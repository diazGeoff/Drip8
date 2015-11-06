class AddFb < ActiveRecord::Migration
  def up
  	add_column :comments, :facebook_id, :string
  end

  def down
  	remove_column :comments, :facebook_id
  end
end
