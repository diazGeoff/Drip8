var drip8 = angular.module( "Drip8" , [ ] );

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
		"Video",
		"$rootScope",
		function directive ( $http , $rootScope , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"compile": function compile ( element , atrributeSet ) {
					return {

						pre: function pre( scope , element , atrributeSet ){
							scope.drips = [];
							scope.queryAllDrips = function queryAllDrips(){
								$http.get( "/api/drip_length" )
								.success( function ( response ) {
									if( response.count != 0 ){
										scope.count = response.count;
										var count = 1;
										scope.responsed = [];
										for( var index = 3 ; index >= 0 ; index-- ){
											var id = scope.count - count
											console.log( id );
											$http.post( "/api/drip_each" , { "drip_id": id } )
											.success( function ( responsed ) {
												scope.responsed.push( responsed );
												console.log( responsed )
											} );
											count++;
										}
										
									}
								} );
								scope.$broadcast( 'end-fetch' , scope.responsed );
							};
							scope.queryAllDrips();
						} , 

						post: function post( scope , element , atrributeSet ){
							scope.queryEachDrip = function queryEachDrip(){
								//codes to query each drip here
							};
							scope.linkUri = function linkUri ( link , service ) {
								console.log( link );
								var video_id = link.split( 'v=' )[1];
								scope.video_id = video_id;
								var ampersandPosition = video_id.indexOf( '&' );
								if ( ampersandPosition != -1 ) {
								  video_id = video_id.substring( 0 , ampersandPosition );
								}
								
								// console.log( service );
								// console.log( Video );
								// console.log( video_id );
								if ( service == "thumb" ) {

									//return Video.thumbnail( video_id );
								} else {
									return Video.videoSource( video_id );
								}	
							};
						}
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

					scope.showVideo = function showVideo ( link ) {
						$( "#videoLink" ).modal( "show" );
						$rootScope.$broadcast( "video-source" , link );
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
		function directive ( $http , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , atrributeSet ) {
					console.log( "drip-modal-bucket" );
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
	.directive( "profile" , [
		"$http",
		"Video",
		"$rootScope",
		function directive ( $http , Video , $rootScope ) {
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
		"$rootScope",
		"$sce",
		function directive ( $http , Video , $rootScope , $sce ) {
			return {
				"restrict": "A",
				"scope": {
					"videoSrc": "="
				},
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSrc = $sce.trustAsResourceUrl( scope.videoSrc );		
				}
			}
		}
	] );
drip8
	.directive( "videoLink" , [
		function  directive ( ) {
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
						function ( evt , src ) {							
							scope.videoSource = src;
						} );
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
				return $sce.trustAsResourceUrl( "https://www.youtube.com/embed/" + youtubeId + "?rel=0&nologo=1&showinfo=0&modestbranding=1&iv_load_policy=3" );
			};

			return this;
		}
	] );