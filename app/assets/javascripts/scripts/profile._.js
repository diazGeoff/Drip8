drip8
	.directive( "profile" , [
		"$http",
		"Video",
		"$rootScope",
		'profileService',
		function directive ( $http , Video , $rootScope , profileService ) {
			return {
				"restrict": "A",
				"scope": true,
				"compile": function compile ( element , attributeSet ){
					return{

						pre: function pre( scope , element , attributeSet ){
							scope.count = 0;
							scope.profileName = function profileName( name ){
								if( name != undefined ){
									scope.count += 1;
									if( scope.count == 1 ){
										var name = name.split( " " );
										console.log( scope.count );
										console.log( name );
										return name[ 0 ];
									}
									
								}
								
							};
						},

						post: function post( scope , element , attributeSet ){
							//console.log( "profile" );
							scope.logout = function logout(){
								var now = new Date();
				                now.setMonth( now.getMonth() - 1 );
				                cookievalue = escape(document.myform.customer.value) + ";"
				               
				                document.cookie="_Drip8_session=" + cookievalue;
				                document.cookie = "expires=" + now.toUTCString() + ";"
								console.log( "logout" );
								// FB.logout(function(response) {
								//   // user is now logged out
								//   console.log( response );
								// });
								console.log( document.cookie )
							};
							$( "#welcomeHere" ).modal( "show" );
							scope.profile = { };					
							
							scope.getUserInfo = function getUserInfo ( ) {
								$http.get( "/api/user" )
								.success( function ( response ) {
									scope.profile = response.data;
									scope.trustUrl( );
								} );
							};
							scope.passProfile = function passProfile( profile ){
								localStorage.setItem("userProfile", JSON.stringify( profile ) );
							};

							
							scope.trustUrl = function trustUrl ( ) {
								var video_id = "";
								$http.post( "/api/video_featured" , {
									"user_id": scope.profile.id
								} )
								.success( function ( response ) {
									if ( response.link ) {
										video_id = response.link.split( 'v=' )[1];
										var ampersandPosition = video_id.indexOf( '&' );
										if ( ampersandPosition != -1 ) {
										  video_id = video_id.substring( 0 , ampersandPosition );
										}
									}

									scope.profile.featured = response.link;
									$rootScope.$broadcast( "profile-data" , scope.profile );
									scope.profile.featuredVideo = Video.videoSource( video_id );								
								} );
							};
							scope.$watch( 'profile' , function( newValue , oldValue ){
								if( newValue != oldValue ){
									scope.profile = newValue;
									console.log( "Profile****" , scope.profile );
									profileService.setProfile( scope.profile );// own profile
								}
							} )
							scope.getUserInfo( );	
							scope.profileData = JSON.parse( localStorage.userProfile ); //visited profile
							console.log( scope.profileData );
						}
					}
				}
			}
		}
	] );