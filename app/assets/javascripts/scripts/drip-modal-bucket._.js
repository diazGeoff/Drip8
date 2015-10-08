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