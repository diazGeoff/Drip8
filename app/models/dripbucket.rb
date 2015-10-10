class Dripbucket < ActiveRecord::Base
	
	has_many :drips
	has_many :acknowledgements
	belongs_to :user
	has_many :comments
end
