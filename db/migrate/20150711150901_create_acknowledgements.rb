class CreateAcknowledgements < ActiveRecord::Migration
  def up
    create_table :acknowledgements do |t|
      t.integer   :dripbucket_id
      t.string    :acknowledge_by
      t.index     :dripbucket_id
      t.timestamps null: false
    end
  end

  def down
  	drop_table :acknowledgements
  end
end
