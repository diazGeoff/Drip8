class AddColumnToDripbucket < ActiveRecord::Migration
  
  def up
  	add_column :dripbuckets ,:starring_drip ,:integer
  end

  def down
  	remove_column :dripbuckets ,:starring_drip
  end
end
