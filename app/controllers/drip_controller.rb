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
		if request.env['omniauth.auth']
			session[:user] = request.env['omniauth.auth']
			redirect_to action: 'home'
		else
			redirect_to action: 'index'
		end
	end

	def home
		puts session[:user]
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
