var drip8 = angular.module( "Drip8" , [ 'angular-flexslider' ] );

window.fbAsyncInit = function ( ) {
	FB.init( {
		"appId"    	 : "719176184895882",
	    "status"     : true,
	    "xfbml"      : true,
	    "version"    : 'v2.3' // or v2.0, v2.1, v2.0
	} );
};
drip8
	.directive( "auth" , [		
		function directive ( ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.login = function login ( ) {
						window.location = "/auth/facebook";
					};
				}
			}
		}
	] );
drip8
	.directive( "bucket" , [
		"$rootScope",
		"$http",
		function directive ( $rootScope , $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];

					scope.newDrip = function newDrip ( id ) {
						$rootScope.$broadcast( "drip-new" , id );
					};

					scope.getDrip = function getDrip ( id ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"user_id": scope.profileData.id,
							"dripbucket_id": id
						} )
						.success( function ( response ) {
							console.log( response );
						} );
					};

					scope.newBucket = function newBucket ( bucket ) {
						$( "#createDripBoardBox" ).modal( "hide" );
						$http.post( "/api/add_bucket" , {
							"bucket": {
								"user_id": scope.profileData.id,
								"name": bucket.name,
								"state": bucket.state
							}
						} ).success( function ( response ) {							
							window.location.reload( );
						} );
					};

					scope.getAllBucket = function getAllBucket ( ) {						
						$http.post( "/api/read_all_bucket_by_user" , {
							"user_id": scope.profileData.id
						} )
						.success( function ( response ) {							
							scope.buckets = response.buckets;
						} );
					};					

					scope.$on( "profile-data" , 
						function ( evt , profile ) {
							scope.profileData = profile;
							scope.getAllBucket( );
						} );					
				}
			}
		}
	] );
drip8
	.directive( "dripDashboard" , [
		"$http",
		'$rootScope',
		function directive ( $http , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.drips = [ ];

					$http.get( "/api/drip_length" )
					.success( function ( response ) {
						var taskArray = [ ];
						for ( var index = response.count - 1  ; index >= ( response.count - 3 ) ; index -- ) {
							taskArray.push( index );
						}
						var asyncTasks = createAsyncTask( taskArray );
						async
							.parallel( asyncTasks , function ( err , taskResponse ) {
								scope.drips = taskResponse;
							} );
					} );

					
					var createAsyncTask = function createAsyncTask ( taskArray ) {
						var tasks = [ ];
						taskArray.forEach( function ( e ) {
							tasks.push( function ( callback ) {
								$http.post( "/api/drip_each" , { "drip_id": e } )
								.success( function ( response ) {
									callback( null , response );
								} );
							} );
						} );
						return tasks;
					};
					scope.seeBucket = function seeBucket( drip ){
						console.log( "see Bucket" );
						$rootScope.$broadcast( 'see-bucket' , drip );
					};

				}
			}
		}
	] );


// async
// 	.parallel( [
// 		function ( callback ) {

// 		},
// 		function ( callback ) {

// 		}, 
// 	] , function doSomething ( err , arr ) {

// 	} );
drip8
	.directive( "dripList" , [
		"$http",
		"Video",
		"$rootScope",
		function directive ( $http , Video , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {

					var ids = attributeSet.dripList.split( "-" );
					scope.drips = [ ];	

					scope.dripListing = function dripListing ( ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"dripbucket_id": ids[0],
							"user_id": ids[1]
						} )
						.success( function ( response ) {
							scope.drips = response.drips;
						} );
					};

					scope.linkUri = function linkUri ( link , service ) {
						var video_id = link.split( 'v=' )[1];
						var ampersandPosition = video_id.indexOf( '&' );
						if ( ampersandPosition != -1 ) {
						  video_id = video_id.substring( 0 , ampersandPosition );
						}
						if ( service == "thumb" ) {
							return Video.thumbnail( video_id );
						} else {
							return Video.videoSource( video_id );
						}	
					};

					scope.showVideo = function showVideo ( link , id ) {
						$( "#videoLink" ).modal( "show" );
						$rootScope.$broadcast( "video-source" , link , id );
					};

					scope.dripListing( );

					scope.$on( "drips-reload" , 
						function ( ) {
							scope.dripListing( );
						} );
				}
			}
		}
	] );
drip8
	.directive( "dripModalBucket" , [
		"$http",
		"$rootScope",
		'Video',
		'profileService',
		function directive ( $http , $rootScope , Video , profileService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , atrributeSet ) {
					console.log( "drip-modal-bucket" );
					$rootScope.$on( 'see-bucket' , function( evt , data ){
						scope.directDrip = Video.videoSource( data.drip.link.split( "v=" )[1] );
						scope.dripBucketDetails = data;
						scope.comments = scope.dripBucketDetails.drip.comments;
						for( var index = 0 ; index <= data.drip.dripbucket.drips.length-1 ; index++ ){
							var video_id = scope.dripBucketDetails.drip.dripbucket.drips[ index ].link.split( "v=" )[1];
							console.log( video_id );
							scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb = Video.thumbnail( video_id );
							console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb );
							console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].link );

						}
						console.log( scope.dripBucketDetails );
						scope.drip = scope.dripBucketDetails.drip;
					} );


					scope.changeVideo = function changeVideo( data ){
						scope.$broadcast( 'change-video' , data )
					};

					scope.$on( 'change-video' , function( evt , data ){
						scope.directDrip = Video.videoSource( data.link.split( "v=" )[1] );
						scope.comments = data.comments;
						scope.drip = data;
						console.log( data );
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
drip8
	.directive( "drip" , [
		"$http",
		"$rootScope",
		function directive ( $http , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , atrributeSet ) {
					scope.dripDetails = { 
						"state": "public"
					};

					scope.profileData = { };

					scope.addDrip = function addDrip ( ) {						
						$( "#addADrip" ).modal( "hide" );
						scope.dripDetails.user_id = scope.profileData.id;

						$http.post( "/api/add_drip" , {
							"drip": scope.dripDetails
						} )
						.success( function ( response ) {
							$rootScope.$broadcast( "drips-reload" );
							scope.dripDetails = { 
								"state": "public"
							};
						} );						
					};

					scope.$on( "drip-new" , 
						function ( evt , bucketId ) {							
							scope.dripDetails.dripbucket_id = bucketId;							
						} );

					scope.$on( "profile-data" , 
						function ( evt , profile ) {
							scope.profileData = profile;
						} );
				}
			}
		}
	] );
drip8
	.directive( "feature" , [
		"$http",
		function directive ( $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {					

					var ids = attributeSet.feature.split( "-" );

					element.bind( "click" , 
						function ( ) {
							$http.post( "/api/new_featured" , {
								"user_id": ids[0],
								"drip_id": ids[1]
							} )
							.success( function ( response ) {
								window.location.reload( );
							} );
						} );
				}
			}
		}
	] );
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
				"link": function onLink ( scope , element , attributeSet ) {
					console.log( "profile" );
					scope.profile = { };					

					scope.getUserInfo = function getUserInfo ( ) {
						$http.get( "/api/user" )
						.success( function ( response ) {
							scope.profile = response.data;
							scope.trustUrl( );
						} );
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
							scope.profile.newValue;
							console.log( scope.profile );
							profileService.setProfile( scope.profile );
						}
					} )
					scope.getUserInfo( );					
				}
			}
		}
	] );
drip8
	.directive( "to" , [
		function directive ( ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {

					element.bind( "click" , 
						function ( ) {
							window.location = attributeSet.to;
						} );
				}
			}
		}
	] );
drip8
	.directive( "uiTemplate" , [
		function directive ( ) {
			return {
				"restrict": "E",
				"scope": true,
				"templateUrl": function onTemplateLoad ( element , attributeSet ) {
					return "/api/template?template=" + attributeSet.ngTemplate;
				}
			}
		}
	] );
drip8
	.directive( "videoDashboard" , [
		"$http",
		"Video",		
		function directive ( $http , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSrc = Video.videoSource( attributeSet.videoSource.split( "v=" )[1] );
				}
			}
		}
	] );
drip8
	.directive( "videoLink" , [
		'$http',
		'profileService',
		function  directive ( $http , profileService ) {
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

					scope.$on( "video-source" , 
						function ( evt , src , id ) {							
							scope.videoSource = src;
							$http.post( "/api/drip_each" , { "drip_id": id } )
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
drip8
	.factory( "Video" , [
		"$sce",
		function factory ( $sce ) {
			this.thumbnail = function thumbnail ( youtubeId ) {
				return $sce.trustAsResourceUrl( "http://img.youtube.com/vi/" + youtubeId + "/0.jpg" );
			};

			this.videoSource = function videoSource ( youtubeId ) {
				return $sce.trustAsResourceUrl( "http://www.youtube.com/embed/" + youtubeId + "?rel=0&nologo=1&showinfo=0&modestbranding=1&iv_load_policy=3" );
			};

			return this;
		}
	] );