class Comment < ActiveRecord::Base
	belongs_to :user
	belongs_to :dripbucket
	belongs_to :drip
end
