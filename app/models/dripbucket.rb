class Dripbucket < ActiveRecord::Base
	
	has_many :drips
	has_many :acknowledgements
	belongs_to :user
	
end
