class Drip < ActiveRecord::Base
	
	belongs_to :user
	belongs_to :dripbucket
	has_many :comments
end
