# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_09_24_181329) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "active_storage_attachments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.uuid "record_id", null: false
    t.uuid "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "activities", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "description"
    t.string "google_event_id", null: false
    t.uuid "owner_id", null: false
    t.tstzrange "during", null: false
    t.string "location"
    t.geography "coordinates", limit: {:srid=>4326, :type=>"st_point", :geographic=>true}
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug", null: false
    t.integer "capacity"
    t.string "name", default: "", null: false
    t.string "tags", default: [], null: false, array: true
    t.string "time_zone_override"
    t.boolean "silent", null: false
    t.index ["coordinates"], name: "index_activities_on_coordinates", using: :gist
    t.index ["google_event_id"], name: "index_activities_on_google_event_id", unique: true
    t.index ["owner_id"], name: "index_activities_on_owner_id"
    t.index ["slug"], name: "index_activities_on_slug", unique: true
    t.index ["tags"], name: "index_activities_on_tags"
  end

  create_table "activities_groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "group_id", null: false
    t.uuid "activity_id", null: false
    t.index ["activity_id"], name: "index_activities_groups_on_activity_id"
    t.index ["group_id", "activity_id"], name: "index_activities_groups_uniqueness", unique: true
    t.index ["group_id"], name: "index_activities_groups_on_group_id"
  end

  create_table "addresses", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "activity_id", null: false
    t.string "city"
    t.string "country", null: false
    t.string "province", null: false
    t.string "postal_code"
    t.string "neighbourhood"
    t.string "full_address", null: false
    t.datetime "created_at", precision: nil, null: false
    t.string "street_address"
    t.string "place_name"
    t.index ["activity_id"], name: "index_addresses_on_activity_id"
  end

  create_table "good_job_batches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "description"
    t.jsonb "serialized_properties"
    t.text "on_finish"
    t.text "on_success"
    t.text "on_discard"
    t.text "callback_queue_name"
    t.integer "callback_priority"
    t.datetime "enqueued_at"
    t.datetime "discarded_at"
    t.datetime "finished_at"
  end

  create_table "good_job_executions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "active_job_id", null: false
    t.text "job_class"
    t.text "queue_name"
    t.jsonb "serialized_params"
    t.datetime "scheduled_at"
    t.datetime "finished_at"
    t.text "error"
    t.integer "error_event", limit: 2
    t.index ["active_job_id", "created_at"], name: "index_good_job_executions_on_active_job_id_and_created_at"
  end

  create_table "good_job_processes", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "state"
  end

  create_table "good_job_settings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "key"
    t.jsonb "value"
    t.index ["key"], name: "index_good_job_settings_on_key", unique: true
  end

  create_table "good_jobs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "queue_name"
    t.integer "priority"
    t.jsonb "serialized_params"
    t.datetime "scheduled_at"
    t.datetime "performed_at"
    t.datetime "finished_at"
    t.text "error"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.uuid "active_job_id"
    t.text "concurrency_key"
    t.text "cron_key"
    t.uuid "retried_good_job_id"
    t.datetime "cron_at"
    t.uuid "batch_id"
    t.uuid "batch_callback_id"
    t.boolean "is_discrete"
    t.integer "executions_count"
    t.text "job_class"
    t.integer "error_event", limit: 2
    t.index ["active_job_id", "created_at"], name: "index_good_jobs_on_active_job_id_and_created_at"
    t.index ["active_job_id"], name: "index_good_jobs_on_active_job_id"
    t.index ["batch_callback_id"], name: "index_good_jobs_on_batch_callback_id", where: "(batch_callback_id IS NOT NULL)"
    t.index ["batch_id"], name: "index_good_jobs_on_batch_id", where: "(batch_id IS NOT NULL)"
    t.index ["concurrency_key"], name: "index_good_jobs_on_concurrency_key_when_unfinished", where: "(finished_at IS NULL)"
    t.index ["cron_key", "created_at"], name: "index_good_jobs_on_cron_key_and_created_at"
    t.index ["cron_key", "cron_at"], name: "index_good_jobs_on_cron_key_and_cron_at", unique: true
    t.index ["finished_at"], name: "index_good_jobs_jobs_on_finished_at", where: "((retried_good_job_id IS NULL) AND (finished_at IS NOT NULL))"
    t.index ["priority", "created_at"], name: "index_good_jobs_jobs_on_priority_created_at_when_unfinished", order: { priority: "DESC NULLS LAST" }, where: "(finished_at IS NULL)"
    t.index ["queue_name", "scheduled_at"], name: "index_good_jobs_on_queue_name_and_scheduled_at", where: "(finished_at IS NULL)"
    t.index ["scheduled_at"], name: "index_good_jobs_on_scheduled_at", where: "(finished_at IS NULL)"
  end

  create_table "google_calendar_channels", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "owner_id", null: false
    t.string "calendar_id", null: false
    t.string "resource_id", null: false
    t.string "token", null: false
    t.datetime "expires_at", precision: nil, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "callback_url", null: false
    t.index ["calendar_id"], name: "index_google_calendar_channels_on_calendar_id", unique: true
    t.index ["owner_id"], name: "index_google_calendar_channels_on_owner_id"
    t.index ["resource_id"], name: "index_google_calendar_channels_on_resource_id", unique: true
    t.index ["token"], name: "index_google_calendar_channels_on_token", unique: true
  end

  create_table "group_memberships", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "group_id", null: false
    t.uuid "member_id", null: false
    t.boolean "admin", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["group_id", "member_id"], name: "index_group_memberships_uniqueness", unique: true
    t.index ["group_id"], name: "index_group_memberships_on_group_id"
    t.index ["member_id"], name: "index_group_memberships_on_member_id"
  end

  create_table "groups", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name", null: false
    t.string "handle", null: false
    t.uuid "owner_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["handle"], name: "index_groups_on_handle", unique: true
    t.index ["owner_id"], name: "index_groups_on_owner_id"
  end

  create_table "mobile_subscribers", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "phone", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["phone"], name: "index_mobile_subscribers_on_phone", unique: true
  end

  create_table "mobile_subscriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "subscriber_id", null: false
    t.uuid "subject_id", null: false
    t.datetime "created_at", precision: nil, null: false
    t.index ["subject_id"], name: "index_mobile_subscriptions_on_subject_id"
    t.index ["subscriber_id", "subject_id"], name: "index_mobile_subscriptions_uniqueness", unique: true
    t.index ["subscriber_id"], name: "index_mobile_subscriptions_on_subscriber_id"
  end

  create_table "reservations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "activity_id", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.string "status", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "phone", null: false
    t.text "note"
    t.index ["activity_id", "email"], name: "index_reservations_uniqueness", unique: true
    t.index ["activity_id"], name: "index_reservations_on_activity_id"
  end

  create_table "scheduled_mobile_notifications", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "activity_id", null: false
    t.uuid "subscriber_id", null: false
    t.datetime "deliver_after", precision: nil, null: false
    t.datetime "delivered_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["activity_id", "subscriber_id"], name: "index_scheduled_mobile_notifications_uniqueness", unique: true
    t.index ["activity_id"], name: "index_scheduled_mobile_notifications_on_activity_id"
    t.index ["deliver_after"], name: "index_scheduled_mobile_notifications_on_deliver_after"
    t.index ["subscriber_id"], name: "index_scheduled_mobile_notifications_on_subscriber_id"
  end

  create_table "subscriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "subscriber_id", null: false
    t.uuid "subject_id", null: false
    t.string "status", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["subject_id"], name: "index_subscriptions_on_subject_id"
    t.index ["subscriber_id", "subject_id"], name: "index_subscriptions_uniqueness", unique: true
    t.index ["subscriber_id"], name: "index_subscriptions_on_subscriber_id"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", null: false
    t.string "encrypted_password", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name", null: false
    t.string "google_uid", null: false
    t.string "google_refresh_token"
    t.string "avatar_url"
    t.string "last_name"
    t.datetime "google_calendar_last_synced_at", precision: nil
    t.string "handle", null: false
    t.string "google_calendar_next_sync_token"
    t.string "google_calendar_next_page_token"
    t.text "bio"
    t.boolean "requires_relogin", null: false
    t.string "phone"
    t.string "calendar_token", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["google_calendar_last_synced_at"], name: "index_users_on_google_calendar_last_synced_at"
    t.index ["handle"], name: "index_users_on_handle", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "activities", "users", column: "owner_id"
  add_foreign_key "activities_groups", "activities"
  add_foreign_key "activities_groups", "groups"
  add_foreign_key "addresses", "activities"
  add_foreign_key "google_calendar_channels", "users", column: "owner_id"
  add_foreign_key "group_memberships", "groups"
  add_foreign_key "group_memberships", "users", column: "member_id"
  add_foreign_key "groups", "users", column: "owner_id"
  add_foreign_key "mobile_subscriptions", "mobile_subscribers", column: "subscriber_id"
  add_foreign_key "mobile_subscriptions", "users", column: "subject_id"
  add_foreign_key "reservations", "activities"
  add_foreign_key "scheduled_mobile_notifications", "activities"
  add_foreign_key "scheduled_mobile_notifications", "mobile_subscribers", column: "subscriber_id"
  add_foreign_key "subscriptions", "users", column: "subject_id"
  add_foreign_key "subscriptions", "users", column: "subscriber_id"
end
