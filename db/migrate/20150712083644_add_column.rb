class AddColumn < ActiveRecord::Migration
  def up
 	add_column :users ,:featured ,:string
  end

  def down
  	remove_column :users ,:featured
  end
end
