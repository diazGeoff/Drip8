class User < ActiveRecord::Base
	
	has_many :drips
	has_many :dripbuckets
	has_many :comments
end
