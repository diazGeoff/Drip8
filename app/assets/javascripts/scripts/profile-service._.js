drip8
	.service( 'profileService' , [
		function(){
			var profile = {};
			return{
				setProfile: function setProfile( credentials ){
					if( credentials ){
						profile = credentials;
						console.log( profile );
					} else {
						return profile;
					}
				}
			}
		}
	] )