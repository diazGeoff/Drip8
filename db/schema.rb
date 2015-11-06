# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151104062813) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "acknowledgements", force: :cascade do |t|
    t.integer  "dripbucket_id"
    t.string   "acknowledge_by"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "acknowledgements", ["dripbucket_id"], name: "index_acknowledgements_on_dripbucket_id", using: :btree

  create_table "comments", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "dripbucket_id"
    t.integer  "drip_id"
    t.text     "body"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.string   "facebook_id"
  end

  add_index "comments", ["drip_id"], name: "index_comments_on_drip_id", using: :btree
  add_index "comments", ["dripbucket_id"], name: "index_comments_on_dripbucket_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "dripbuckets", force: :cascade do |t|
    t.string   "name"
    t.string   "state"
    t.integer  "user_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.integer  "starring_drip"
    t.string   "status",        default: "Public"
  end

  add_index "dripbuckets", ["user_id"], name: "index_dripbuckets_on_user_id", using: :btree

  create_table "drippers", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "drippers", ["email"], name: "index_drippers_on_email", unique: true, using: :btree
  add_index "drippers", ["reset_password_token"], name: "index_drippers_on_reset_password_token", unique: true, using: :btree

  create_table "drips", force: :cascade do |t|
    t.text     "link"
    t.string   "title"
    t.text     "description"
    t.string   "state"
    t.integer  "user_id"
    t.integer  "dripbucket_id"
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
    t.boolean  "featured"
    t.string   "status",        default: "Public"
  end

  add_index "drips", ["dripbucket_id"], name: "index_drips_on_dripbucket_id", using: :btree
  add_index "drips", ["user_id"], name: "index_drips_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "name"
    t.text     "profile_picture"
    t.text     "featured_drip_link"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.string   "featured"
  end

end
