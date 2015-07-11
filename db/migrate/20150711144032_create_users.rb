class CreateUsers < ActiveRecord::Migration
  def up
    create_table :users do |t|
      t.string :email
      t.string :name
      t.text   :profile_picture
      t.text   :featured_drip_link
      t.timestamps null: false
    end
  end

  def down
  	drop_table :users
  end
end
