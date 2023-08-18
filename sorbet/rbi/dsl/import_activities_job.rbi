# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `ImportActivitiesJob`.
# Please instead update this file by running `bin/tapioca dsl ImportActivitiesJob`.

class ImportActivitiesJob
  class << self
    sig { params(max_users: T.nilable(::Integer)).returns(T.any(ImportActivitiesJob, FalseClass)) }
    def perform_later(max_users: T.unsafe(nil)); end

    sig { params(max_users: T.nilable(::Integer)).void }
    def perform_now(max_users: T.unsafe(nil)); end
  end
end
