Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :facebook, '761394880632802', 'd6f1888aaab701b8e18e0963e414b25b', :display => 'page', :scope => 'email', 
  	:image_size => { :width => "200" , :height => "200" }, :info_fields => 'name,email,gender'
end