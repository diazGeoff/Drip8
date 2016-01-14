var drip8 = angular.module( "Drip8" , [ 'angular-flexslider' , 'infinite-scroll' ] );


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
		'dripListService',
		function directive ( $rootScope , $http , profileService , dripListService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];
					////console.log( localStorage.userProfile );
					scope.newDrip = function newDrip ( id , bucketName ) {
						$rootScope.$broadcast( "drip-new" , id , bucketName );
					};

					scope.getDrip = function getDrip ( id ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"user_id": scope.profileData.id,
							"dripbucket_id": id
						} )
						.success( function ( response ) {
							//console.log( response );
						} );
					};

					scope.description= function description( desc ){
						return desc != null;
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
							if( profile.id == '1' ){

								if( scope.profileData.id == '1' ){
									scope.buckets.splice( 0 , 3 );
									//console.log( scope.buckets );
								}
								
							}
						} );
					};
					scope.rename = function rename ( drip , target ) {						
						////console.log( drip , target );
					};
					
					var createAsyncTask = function createAsyncTask ( taskArray , setting ) {
						var tasks = [ ];

						taskArray.forEach( function ( e ) {
							//console.log( e )
							if( setting == 'public' ){
								setting = e.state
							}else{
								setting = 'profile only'
							}
							tasks.push( function ( callback ) {
								$http.post( "/api/update_drip_state" , { 
									"drip_id": e.id,
									"state": setting  
								} )
								.success( function ( response ) {
									callback( null , response );
								} );
							} );
						} );
						return tasks;
					};

					scope.setting = function setting ( drips , setting , target , id ) {						
						////console.log( drips , setting , target );

						switch( target ){

							case 'drip':
								$http.post( '/api/update_drip_state' , {
									"drip_id": drips.id,
									"state": setting 
								})
								.success( function( response ){
									//console.log( "New" , response );
									scope.$broadcast( "drips-reload" );
								} )
								break;
							case 'bucket':
								//console.log( id );
								var dripList = dripListService.setDripList();
								var list = dripList[ id ];
								//console.log( list )

								var asyncTasks = createAsyncTask( list , setting );
								async
									.parallel( asyncTasks , function ( err , taskResponse ) {
										//console.log( taskResponse );
										scope.$broadcast( "drips-reload" );
									} );
						}
						
					};
					scope.deleteDrip = function deleteDrip ( drip , target ) {						
						//console.log( drip , target );
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
							//console.log( "profile data below" )
							//console.log( scope.profileData )
							scope.getAllBucket( );
						} );						
				}
			}
		}
	] );

drip8
	.directive( "ifBucket" , [
		"$http",
		function directive ( $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {					

					console.log( scope.$parent.bucketName );
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
									if( taskResponse[ index ].drip == null || taskResponse[ index ].drip.state != 'public' || taskResponse[ index ].drip.state == 'deleted' ){
										//console.log( "***************************deleted" , taskResponse[ index ].drip );
										taskResponse.splice( index , 1 );
									}
									
								}
								scope.drips = taskResponse;
								//console.log( taskResponse );
							} );
					
						
						
					} );
					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
					scope.fbShare = function fbShare( link ){
						FB.ui({
						  method: 'share',
						  href: link,
						  caption: "www.drip8.com",
						}, function(response){});
						//console.log( link );
					};
					var createAsyncTask = function createAsyncTask ( taskArray ) {
						var tasks = [ ];
						taskArray.forEach( function ( e ) {
							//console.log( e )
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
						//console.log( "see Bucket" );
						$rootScope.$broadcast( 'see-bucket' , drip );
					};

					scope.loadMore = function loadMore() {
						//console.log( " ***************  " )
						//console.log( scope.drips );
						//console.log( scope.drips[scope.drips.length - 1] );
					    var last = scope.drips[scope.drips.length - 1];
					    if( last != null ){
					    	var lastId = last.drip.id;
						    var idLoad = lastId - 1;
						    if( lastId >= 0 && scope.lastId != 'stop' ){
						    	//console.log( scope.lastId );
						    	//console.log( lastId );
						    	$http.post( "/api/drip_each" , { "drip_id": idLoad } )
									.success( function ( response ) {
										//callback( null , response );
										//console.log( response );
										if( response.drip.state == 'deleted' ){
											$http.post( "/api/drip_each" , { "drip_id": response.drip.id-1 } )
												.success( function ( response ) {
													//callback( null , response );
													//console.log( response );
													if( response.drip != null && response.drip.state == 'public' ){
														scope.drips.push( response );
														//console.log( "pushed" )
													}
													if( lastId == 0 ){
														//console.log( "stop na" )
														scope.lastId = 'stop';
														//console.log( scope.lastId );
													}
												} );
										}
										if( response.drip != null && response.drip.state == 'public' ){
											scope.drips.push( response );
											//console.log( "pushed" )
										}
										if( lastId == 0 ){
											//console.log( "stop na" )
											scope.lastId = 'stop';
											//console.log( scope.lastId );
										}
									} );
						    }
					    }
					};

				}
			}
		}
	] );

drip8
	.directive( "welcome" , [
		function directive ( ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					console.log( "hide initialize" );
					scope.$watch( 'hideMe',
						function hideMessage( newValue , oldValue ){
							if( newValue != oldValue ){
								console.log( "clicked" )
								if( newValue == true ){
									localStorage.setItem( "hideMessage", true );

								}else{
									localStorage.setItem( "hideMessage", false );
								}
							}
						}
					);

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
	.service( "dripListService" , [
			function(){
				var dripList = [];

				return {
					// takes id of dripBucket and sets drips in
					setDripList: function setDripList( id , credentials ){
						if( credentials ){
							dripList[ id ] = credentials;
						}else{
							return dripList
						}
					}
				}
			}
		] );

drip8
	.directive( "dripList" , [
		"$http",
		"Video",
		"$rootScope",
		'dripListService',
		function directive ( $http , Video , $rootScope , dripListService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {

					var ids = attributeSet.dripList.split( "-" );
					//console.log( ids[ 2 ] );
					scope.drips = [ ];

					var dripFilter = function dripFilter ( array ){
						var newDripArray = [];

						array.forEach( function( e ) {
							if( e.state != 'deleted' ){
								newDripArray.push( e );
							}
						} );
						return newDripArray;
					};

					scope.dripListing = function dripListing ( ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"dripbucket_id": ids[0],
							"user_id": ids[1]
						} )
						.success( function ( response ) {
							scope.drips = response.drips;
							dripListService.setDripList( ids[ 2 ] , scope.drips );
							
							scope.drips = dripFilter( scope.drips );
							$("#welcome").modal("hide");
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

					scope.showVideo = function showVideo ( link , drip ) {
						$( "#videoLink" ).modal( "show" );
						$rootScope.$broadcast( "video-source" , link , drip );
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
					//console.log( "drip-modal-bucket" );
					$rootScope.$on( 'see-bucket' , function( evt , data ){
						//console.log( data )
						scope.directDrip = Video.videoSource( data.drip.link.split( "v=" )[1] );
						scope.dripBucketDetails = data;
						scope.comments = scope.dripBucketDetails.drip.comments;
						for( var index = 0 ; index <= data.drip.dripbucket.drips.length-1 ; index++ ){
							var video_id = scope.dripBucketDetails.drip.dripbucket.drips[ index ].link.split( "v=" )[1];
							//console.log( video_id );
							scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb = Video.thumbnail( video_id );
							//console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].thumb );
							//console.log( scope.dripBucketDetails.drip.dripbucket.drips[ index ].link );

						}
						//console.log( scope.dripBucketDetails );
						scope.drip = scope.dripBucketDetails.drip;
					} );

					scope.exit = function exit(){
						$("#myModal").modal("hide");
					};

					scope.fbShare = function fbShare( link ){
						FB.ui({
						  method: 'share',
						  href: link,
						  caption: "www.drip8.com",
						}, function(response){});
						//console.log( link );
					};
					
					scope.changeVideo = function changeVideo( data ){
						scope.$broadcast( 'change-video' , data )
					};

					scope.$on( 'change-video' , function( evt , data ){
						scope.directDrip = Video.videoSource( data.link.split( "v=" )[1] );
						scope.comments = data.comments;
						scope.drip = data;
						//console.log( data );
					} );

					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
					scope.react = function react( comment ){
						var user = profileService.setProfile();
						var fbId = user.profile_picture.split( "/" )[3];
						//console.log( scope.dripBucketDetails );
						//console.log( user.profile_picture.split( "/" ) )
						
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
						var http = scope.dripDetails.link.slice( 0 , 5 );
						if( http == "https" ){
							var link = scope.dripDetails.link.replace( 'https' , 'http' );
							scope.dripDetails.link = link;
						}
						

						//console.log( scope.dripDetails.link.split( ":" ) )
						$http.post( "/api/add_drip" , {
							"drip": scope.dripDetails
						} )
						.success( function ( response ) {
							$rootScope.$broadcast( "drips-reload" );
							scope.dripDetails = { 
								"state": "public"
							};
						} );
						//console.log( link );			
					};
					/**
						 * JavaScript function to match (and return) the video Id 
						 * of any valid Youtube Url, given as input string.
						 * @author: Stephan Schmitz <eyecatchup@gmail.com>
						 * @url: http://stackoverflow.com/a/10315969/624466
						 ng-pattern
						 /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
					*/
					scope.dripState = function dripState(){
						if( scope.bucketName == 'who I am' || scope.bucketName == 'what I do' || scope.bucketName == 'what I am proud of' ){
							return false;
						}else{
							return true;
						}
					}
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
				"compile": function compile ( element , attributeSet ){
					return{

						pre: function pre( scope , element , attributeSet ){
							scope.count = 0;
							scope.profileName = function profileName( name ){
								if( name != undefined ){
									scope.count += 1;
									if( scope.count == 1 ){
										var name = name.split( " " );
										//console.log( scope.count );
										//console.log( name );
										return name[ 0 ];
									}
									
								}
								
							};
						},

						post: function post( scope , element , attributeSet ){
							////console.log( "profile" );
							scope.logout = function logout(){
								var now = new Date();
				                now.setMonth( now.getMonth() - 1 );
				                cookievalue = escape(document.myform.customer.value) + ";"
				               
				                document.cookie="_Drip8_session=" + cookievalue;
				                document.cookie = "expires=" + now.toUTCString() + ";"
								//console.log( "logout" );
								// FB.logout(function(response) {
								//   // user is now logged out
								//   //console.log( response );
								// });
								//console.log( document.cookie )
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
									//console.log( "Profile****" , scope.profile );
									profileService.setProfile( scope.profile );// own profile
								}
							} )
							scope.getUserInfo( );	
							scope.profileData = JSON.parse( localStorage.userProfile ); //visited profile
							//console.log( scope.profileData );
						}
					}
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
						//console.log( 'exit' )
					};
					scope.$on( "video-source" , 
						function ( evt , src , drip ) {							
							scope.videoSource = src;
							//console.log( drip );
							scope.directDrip = Video.videoSource( drip.link.split( "v=" )[1] );
							$http.post( "/api/drip_each" , { "drip_id": drip.id } )
								.success( function ( response ) {
									//console.log( response );
									scope.comments = response.drip.comments;
									scope.drip = response.drip;
									
								} );
						} );
					scope.fbShare = function fbShare( link ){
						FB.ui({
						  method: 'share',
						  href: link,
						  caption: "www.drip8.com",
						}, function(response){});
						//console.log( link );
					};
					scope.react = function react( comment ){
						var user = profileService.setProfile();
						var fbId = user.profile_picture.split( "/" )[3];
						//console.log( scope.dripBucketDetails );
						//console.log( user.profile_picture.split( "/" ) )
						
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