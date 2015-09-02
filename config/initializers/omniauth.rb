Rails.application.config.middleware.use OmniAuth::Builder do  
  provider :facebook, '1490365664608851', 'b63a6535af7cb37e70a6cc7825df124e', :display => 'page', :scope => 'email', 
  	:image_size => { :width => "200" , :height => "200" }, :info_fields => 'name,email,gender,address'
end