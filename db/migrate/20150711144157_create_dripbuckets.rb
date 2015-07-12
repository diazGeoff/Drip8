class CreateDripbuckets < ActiveRecord::Migration
  def up
    create_table :dripbuckets do |t|
      t.string  :name
      t.string  :state
      t.integer :user_id
      t.index   :user_id
      t.timestamps null: false
    end
  end

  def down
  	drop_table :dripbuckets
  end
end
