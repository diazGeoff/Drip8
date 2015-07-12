class User < ActiveRecord::Base
	
	has_many :drips
	has_many :dripbuckets
	
end
