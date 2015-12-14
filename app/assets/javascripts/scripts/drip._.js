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
						

						console.log( scope.dripDetails.link.split( ":" ) )
						$http.post( "/api/add_drip" , {
							"drip": scope.dripDetails
						} )
						.success( function ( response ) {
							$rootScope.$broadcast( "drips-reload" );
							scope.dripDetails = { 
								"state": "public"
							};
						} );
						console.log( link );			
					};
					/**
						 * JavaScript function to match (and return) the video Id 
						 * of any valid Youtube Url, given as input string.
						 * @author: Stephan Schmitz <eyecatchup@gmail.com>
						 * @url: http://stackoverflow.com/a/10315969/624466
						 ng-pattern
						 /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
					*/

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