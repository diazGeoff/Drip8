Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :facebook, '719176184895882', '1c8cd0f0c4a594ff0ca2bed94a28cd5d', :display => 'page', :scope => 'email', 
  	:image_size => { :width => "200" , :height => "200" }, :info_fields => 'name,email,gender,address'
end