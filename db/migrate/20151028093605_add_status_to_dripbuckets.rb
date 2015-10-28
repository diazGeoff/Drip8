class AddStatusToDripbuckets < ActiveRecord::Migration
    def up
  	add_column :dripbuckets, :status, :string, default: "Public"
  end

  def down
  	remove_column :dripbuckets, :status
  end
end
