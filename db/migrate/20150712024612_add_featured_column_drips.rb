class AddFeaturedColumnDrips < ActiveRecord::Migration
  def up
  	add_column :drips, :featured, :boolean
  end

  def down
  	remove_column :drips, :featured
  end
end
