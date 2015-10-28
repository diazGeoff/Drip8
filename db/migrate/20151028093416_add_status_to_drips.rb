class AddStatusToDrips < ActiveRecord::Migration
    def up
  	add_column :drips, :status, :string, default: "Public"
  end

  def down
  	remove_column :drips, :status
  end
end
