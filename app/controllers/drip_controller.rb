class DripController < ApplicationController
	before_action :check , :except => [ :index , :facebook_callback ]
	before_action :logged , :only => [ :index , :facebook_callback ]

	def check
		unless session[:user]
			redirect_to action: 'index'
		end

		return true
	end

	def logged
		if session[:user]
			redirect_to action: 'home'
		end

		return true
	end

	def index		
		render :index
	end	

	def facebook_callback
		@oauth = request.env['omniauth.auth']
		if @oauth
			@user = User.find_by_email( @oauth[:info][:email] )
			if !@user
				@user = User.create( :email => @oauth[:info][:email] , :name => @oauth[:info][:name] , :profile_picture => @oauth[:info][:image] )
				bucket_info = ["who I am","what I do","what I am proud of"]
				bucket_info.each do |name|
					@bucket = Dripbucket.create(:name => name, :user_id => @user.id, :state => "public")
				end
			end
			session[:user] = @user
			session[:oauth] = request.env['omniauth.auth']			
			redirect_to action: 'home'
		else
			redirect_to action: 'index'
		end
	end

	def home		
		render :dashboard
	end

	def profile
		render :profile
	end

	def logout
		session.clear
		redirect_to action: 'index'
	end	
end
