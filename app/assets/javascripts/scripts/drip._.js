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