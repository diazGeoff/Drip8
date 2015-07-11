class Drip < ActiveRecord::Base
	
	belongs_to :user
	belongs_to :dripbucket
	
end
