class ApiClientController < ApplicationController
	before_action :check

	def check
		unless session[:user]
			render json: { status: "Not Authorized" }
		end

		return true
	end

	def user_info
		render json: { data: session[:user] }, status: :ok
	end

	def get_temp
		render template: 'api_client/' + params[:template], :layout => false
	end
end
