var drip8 = angular.module( "Drip8" , [ 'angular-flexslider' , 'infinite-scroll' ] );

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
		'profileService',
		function directive ( $rootScope , $http , profileService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];
					//console.log( localStorage.userProfile );
					scope.newDrip = function newDrip ( id , bucketName ) {
						$rootScope.$broadcast( "drip-new" , id , bucketName );
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
							var profile = profileService.setProfile();
							if( scope.profileData.id == '1' || profile.id == '1' ){
								scope.buckets.splice( 0 , 3 );
								//console.log( scope.buckets );
							}
						} );
					};
					scope.rename = function rename ( drip , target ) {						
						//console.log( drip , target );
					};
					scope.setting = function setting ( drips , setting , target ) {						
						console.log( drips , setting , target );

						switch( target ){

							case 'drip':
								$http.post( '/api/update_drip_state' , {
									"drip_id": drip.id,
									"state": setting 
								})
								.success( function( response ){
									console.log( drips );
								} )
								break;
							case 'bucket':
								console.log( scope.drips );
						}
						
					};
					scope.deleteDrip = function deleteDrip ( drip , target ) {						
						console.log( drip , target );
					};				

					scope.settingDropdown = function settingDropdown( name ){
						var profile = profileService.setProfile() // actual profile
						if( scope.profileData.id != profile.id ){
							return false;
						}else{
							switch( name ){

								case 'who I am':
									return false;
									break;
								case 'what I do':
									return false;
									break;
								case 'what I am proud of':
									return false;
									break;
								default:
									return true;
							}
						}
					};


					scope.$on( "profile-data" , 
						function ( evt , profile ) {
							scope.profileData = JSON.parse( localStorage.userProfile );// visited profile 
							console.log( "profile data below" )
							console.log( scope.profileData )
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
					scope.lastId = "dont stop";
					$http.get( "/api/drip_length" )
					.success( function ( response ) {
						var taskArray = [ ];
						
						for ( var index = response.count  ; index >= ( response.count - 3 ) ; index -- ) {
							taskArray.push( index );
						}
						var asyncTasks = createAsyncTask( taskArray );
						async
							.parallel( asyncTasks , function ( err , taskResponse ) {
								for( var index = 0 ; index < taskResponse.length ; index++ ){
									if( taskResponse[ index ].drip == null || taskResponse[ index ].drip.state != 'public' ){
										taskResponse.splice( index , 1 );
									}
									console.log( taskResponse[ index ].drip );
								}
								scope.drips = taskResponse;
								console.log( taskResponse );
							} );
					
						
						
					} );
					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
					var createAsyncTask = function createAsyncTask ( taskArray ) {
						var tasks = [ ];
						taskArray.forEach( function ( e ) {
							console.log( e )
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

					scope.loadMore = function loadMore() {
						console.log( " ***************  " )
						console.log( scope.drips );
						console.log( scope.drips[scope.drips.length - 1] );
					    var last = scope.drips[scope.drips.length - 1];
					    if( last != null ){
					    	var lastId = last.drip.id;
						    var idLoad = lastId - 1;
						    if( lastId >= 0 && scope.lastId != 'stop' ){
						    	console.log( scope.lastId );
						    	$http.post( "/api/drip_each" , { "drip_id": idLoad } )
									.success( function ( response ) {
										//callback( null , response );
										console.log( response );
										if( response.drip != null && response.drip.state == 'public' ){
											scope.drips.push( response );
										}
										if( lastId == 0 ){
											scope.lastId = 'stop';
											console.log( scope.lastId );
										}
									} );
						    }
					    }
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

					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
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
						"state": "profile only"
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
						function ( evt , bucketId , bucketName ) {							
							scope.dripDetails.dripbucket_id = bucketId;
							scope.bucketName = bucketName;
							scope.dripState = function dripState(){
								if( scope.bucketName == 'who I am' || scope.bucketName == 'what I do' || scope.bucketName == 'what I am proud of' ){
									return false;
								}else{
									return true;
								}
							}		
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
						//console.log( profile );
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
					//console.log( "profile" );
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
							scope.profile.newValue;
							console.log( "Profile****" , scope.profile );
							profileService.setProfile( scope.profile );
						}
					} )
					scope.getUserInfo( );	
					scope.profileData = JSON.parse( localStorage.userProfile );
					console.log( scope.profileData );
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