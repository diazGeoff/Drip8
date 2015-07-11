class ApiController < ApplicationController

	def new_user
		@user = User.create(user_params)
		render json: {:status => "success" , :user => @user} ,status: :created
	end

	def read_drips_by_bucket_and_user

		@drips = Drip.where(:user_id => params[:user_id]).where(:dripbucket_id => params[:dripbucket_id])
		render json: { :status => "success" , :drips => @drips }, status: :created 
		
	end

	def read_all_drips_by_user
		@drips = Drip.where(:user_id => params[:user_id])
		render json: {:status => "success" ,:drips => @drips } , status: :created
	end

	def add_drip
		@drip = Drip.create(drip_params)
		render json: {:status => "success" , :drip => @drip} ,status: :created
	end

	def login
		@user = User.find_by_email(params[:email])
		@drips = @user.drips
		render json: {:status => "success", :user =>@user, :drips => @drips}, status: :created
		
	end



	private

	def drip_params
		params.require(:drip).permit(:link, :title, :description, :state, :user_id, :dripbucket_id)
	end

	def user_params
		params.require(:user).permit(:email, :name, :profile_picture)
	end
end
