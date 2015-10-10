class CreateComments < ActiveRecord::Migration
  def up
    create_table :comments do |t|
      t.integer  :user_id
      t.integer  :dripbucket_id
      t.integer	 :drip_id
      t.text	 :body
      t.index    :user_id
      t.index	 :dripbucket_id
      t.index 	 :drip_id
      t.timestamps null: false
    end
  end

  def down
  	drop_table :comments
  end
end
