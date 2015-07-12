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