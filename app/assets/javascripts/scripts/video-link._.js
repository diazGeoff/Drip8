drip8
	.directive( "videoLink" , [
		'$http',
		'profileService',
		'Video',
		function  directive ( $http , profileService , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSource;

					$( "#videoLink" ).on( "hidden.bs.modal" , 
						function ( ) {
							scope.$apply( function ( ) {
								scope.videoSource = "";
							} );
						} );
					scope.exit = function exit(){
						$("#videoLink").modal("hide");
					};
					scope.$on( "video-source" , 
						function ( evt , src , drip ) {							
							scope.videoSource = src;
							console.log( drip );
							scope.directDrip = Video.videoSource( drip.link.split( "v=" )[1] );
							$http.post( "/api/drip_each" , { "drip_id": drip.id } )
								.success( function ( response ) {
									console.log( response );
									scope.comments = response.drip.comments;
									scope.drip = response.drip;
									
								} );
						} );
					scope.react = function react( comment ){
						var user = profileService.setProfile();
						var fbId = user.profile_picture.split( "/" )[3];
						console.log( scope.dripBucketDetails );
						console.log( user.profile_picture.split( "/" ) )
						
						$http.post( "/api/create_comment" , {
								"comment":{
									"user_id"		: user.id ,
									"drip_id"		: scope.drip.id ,
									"dripbucket_id"	: "" ,
									"facebook_id"	: fbId ,
									"body"			: comment
								}
								} )
								.success( function ( response ) {
									var comment = response.comment;
									comment.user = user;
									scope.comments.push( comment );
								} );
						scope.dripComment = "";
					}

				}
			}
		}
	] );