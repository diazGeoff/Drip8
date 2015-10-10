class ApiController < ApplicationController


	def new_user
		@user = User.find_by_email(params[:user][:email]) 		
		if !@user					
			@user = User.create(user_params)
			bucket_info = ["who I am","what I do","what I am proud of"]
			bucket_info.each do |name|
				@bucket = Dripbucket.create(:name => name, :user_id => @user.id, :state => "public")
			end
		end
		render json: {:status => "success" , :user => @user} ,status: :created
	end

	def read_drips_by_bucket_and_user

		@drips = Drip.where(:user_id => params[:user_id]).where(:dripbucket_id => params[:dripbucket_id])
		render json: { :status => "success" , :drips => @drips }, status: :created 
		
	end

	def drip_length
		count = Drip.all.count
		render json: {status: :success, count: count}
	end


	def drip_each
		drip = Drip.find_by_id(params[:drip_id]).as_json(include: [:user,
			{dripbucket: {include: [{comments: {include: :user}},
				{drips: {include: {comments: {include: :user}}}}]}}])
		render json: {status: :success, drip: drip}
	end

	def read_all_bucket_by_user
		@user = User.find_by_id(params[:user_id])
		@buckets = @user.dripbuckets
		render json: {:status => "success", :buckets => @buckets}, status: :created
	end

	def add_bucket
		@bucket = Dripbucket.create(bucket_params)
		render json: {:status => "success", :bucket => @bucket}, status: :created
	end

	def read_all_drips_by_user
		@drips = Drip.where(:user_id => params[:user_id])
		render json: {:status => "success" ,:drips => @drips } , status: :created
	end

	def add_drip
		@drip = Drip.create(drip_params)
		if @drip.id.equal?(1)
			@drip.featured = true
			@drip.save
		end
		render json: {:status => "success" , :drip => @drip} ,status: :created
	end

	def new_featured
		@drip = User.find_by_id(params[:user_id]).drips.where(:featured => true)
		@drip[0].featured = false
		@drip[0].save
	    @new_drip = Drip.find_by_id(params[:drip_id])
	    @new_drip.featured = true
	    @new_drip.save

		render json: {:status => "success", :drip => @new_drip}, status: :created
	end

	def read_featured_drip
		@drip = User.find_by_id(params[:user_id]).drips.where(:featured => true)
		render json: {:status => "success" ,:drip => @drip}, status: :created
	end

	def login
		@user = User.find_by_email(params[:email])
		@drips = @user.drips
		render json: {:status => "success", :user =>@user, :drips => @drips}, status: :created
		
	end

	def create_comment
		comment = Comment.create(comment_params)
		render json: {status: :success, comment: comment}
	end


	private

	def drip_params
		params.require(:drip).permit(:link, :title, :description, :state, :user_id, :dripbucket_id)
	end

	def user_params
		params.require(:user).permit(:email, :name, :profile_picture)
	end

	def bucket_params
		params.require(:bucket).permit(:user_id, :name, :state)
	end

	def comment_params
		params.require(:comment).permit(:user_id, :drip_id, :dripbucket_id, :facebook_id, :body)
	end
end
