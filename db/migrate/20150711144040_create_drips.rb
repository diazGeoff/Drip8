class CreateDrips < ActiveRecord::Migration
  def up
    create_table :drips do |t|
      t.text     :link
      t.string   :title
      t.text     :description
      t.string   :state
      t.integer  :user_id
      t.integer  :dripbucket_id
      t.index    :user_id
      t.index	 :dripbucket_id
      t.timestamps null: false
    end
  end

  def down
  	drop_table :drips
  end
end
