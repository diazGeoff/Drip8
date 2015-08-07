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

ActiveRecord::Schema.define(version: 20150712083644) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "acknowledgements", force: :cascade do |t|
    t.integer  "dripbucket_id"
    t.string   "acknowledge_by"
    t.datetime "created_at",     null: false
    t.datetime "updated_at",     null: false
  end

  add_index "acknowledgements", ["dripbucket_id"], name: "index_acknowledgements_on_dripbucket_id", using: :btree

  create_table "dripbuckets", force: :cascade do |t|
    t.string   "name"
    t.string   "state"
    t.integer  "user_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.integer  "starring_drip"
  end

  add_index "dripbuckets", ["user_id"], name: "index_dripbuckets_on_user_id", using: :btree

  create_table "drips", force: :cascade do |t|
    t.text     "link"
    t.string   "title"
    t.text     "description"
    t.string   "state"
    t.integer  "user_id"
    t.integer  "dripbucket_id"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.boolean  "featured"
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
