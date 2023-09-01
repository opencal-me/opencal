# typed: strict
# frozen_string_literal: true

class GoogleEventTitle < T::Struct
  extend T::Sig

  # == Constants
  CAPACITY_TAG_REGEXP = %r{^/([0-9]+)$}

  # == Properties
  const :name, String
  const :tags, T::Array[String]
  const :open, T::Boolean
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
      tags_bit = scanner.scan_until(/\]/)
      if tags_bit
        modifiers.concat(tags_bit[0..-2].strip.split(" "))
      else
        name_parts << "[" + scanner.rest
        break
      end
    end
    name = name_parts.filter_map { |part| part.strip.presence }.join(" ")
    open = modifiers.delete("open").present?
    capacity_tags, tags = modifiers.partition do |tag|
      tag.match?(CAPACITY_TAG_REGEXP)
    end
    capacity = if (tag = capacity_tags.first)
      match = T.must(CAPACITY_TAG_REGEXP.match(tag))
      match.captures.first!.to_i
    end
    new(name:, tags:, open:, capacity:)
  end

  # == Builders
  sig { returns(T.attached_class) }
  def self.blank
    new(name: "", tags: [], open: false, capacity: nil)
  end

  # == Methods
  sig { returns(T::Boolean) }
  def open? = open
end
