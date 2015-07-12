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
		function directive ( $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {

					scope.buckets = [ 
						{
							"title": "Who I am",
							"id": "1"
						} , 
						{
							"title": "What I do",
							"id": "2"
						} , 
						{
							"title": "What I am proud of",
							"id": "3"
						} 
					];

					scope.newDrip = function newDrip ( id ) {
						$rootScope.$broadcast( "drip-new" , id );
					};
				}
			}
		}
	] );
drip8
	.directive( "drip" , [
		"$http",
		function directive ( $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , atrributeSet ) {
					scope.dripDetails = { 
						"state": "public"
					};

					scope.addDrip = function addDrip ( ) {						
						$( "#addADrip" ).modal( "hide" );						
						scope.dripDetails = { 
							"state": "public"
						};
					};

					scope.$on( "drip-new" , 
						function ( evt , bucketId ) {							
							scope.dripDetails.dripbucket_id = bucketId;							
						} );
				}
			}
		}
	] );
drip8
	.directive( "profile" , [
		"$http",
		"Video",
		function directive ( $http , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.profile = { };
					scope.featuredDrip = "1ReuOnKSi0s";

					scope.getUserInfo = function getUserInfo ( ) {
						$http.get( "/api/user" )
						.success( function ( response ) {
							scope.profile = response.data;
						} );
					};

					scope.featured = function featured ( ) {
						return Video.videoSource( scope.featuredDrip );
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