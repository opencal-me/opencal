# typed: strict
# frozen_string_literal: true

class GoogleEventTitle < T::Struct
  extend T::Sig

  # == Constants
  CAPACITY_TAG_REGEXP = %r{^/([0-9]+)$}

  # == Properties
  const :name, String
  const :tags, T::Array[String]
  const :mentions, T::Array[String]
  const :open, T::Boolean
  const :silent, T::Boolean
  const :capacity, T.nilable(Integer)

  # == Parsing
  sig { params(title: String).returns(T.attached_class) }
  def self.parse(title)
    scanner = StringScanner.new(title)
    name_parts = T.let([], T::Array[String])
    modifiers = T.let([], T::Array[String])
    until scanner.eos?
      name_bit = scanner.scan_until(/\[/)
      if name_bit
        name_parts << name_bit[0..-2]
      else
        name_parts << scanner.rest
        break
      end
      modifiers_bit = scanner.scan_until(/\]/)
      if modifiers_bit
        modifiers.concat(modifiers_bit[0..-2].strip.split(" "))
      else
        name_parts << "[" + scanner.rest
        break
      end
    end
    name = name_parts.filter_map { |part| part.strip.presence }.join(" ")
    open = modifiers.delete("open").present?
    silent = modifiers.delete("silent").present? || modifiers.include?("demo")
    mentions = T.let([], T::Array[String])
    tags = T.let([], T::Array[String])
    capacity = T.let(nil, T.nilable(Integer))
    modifiers.each do |modifier|
      if capacity.nil? &&
          (match = CAPACITY_TAG_REGEXP.match(modifier)) &&
          (capture = match.captures.first)
        capacity = capture.to_i
      elsif modifier.start_with?("@")
        mentions << modifier
      else
        tags << modifier
      end
    end
    new(name:, mentions:, tags:, open:, silent:, capacity:)
  end

  # == Builders
  sig { returns(T.attached_class) }
  def self.blank
    new(
      name: "",
      mentions: [],
      tags: [],
      open: false,
      silent: false,
      capacity: nil,
    )
  end

  # == Methods
  sig { returns(T::Boolean) }
  def open? = open

  sig { returns(T::Boolean) }
  def silent? = silent
end
