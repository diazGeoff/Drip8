drip8
	.directive( "dripDashboard" , [
		"$http",
		"$rootScope",
		function directive ( $http , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"compile": function compile ( element , atrributeSet ) {
					return {

						pre: function pre( scope , element , atrributeSet ){
							scope.queryAllDrips = function queryAllDrips(){
								$http.get( "/api/drip_length" )
								.success( function ( response ) {
									console.log( response )
								} );
							};
							scope.queryAllDrips();
						} , 

						post: function post( scope , element , atrributeSet ){
							scope.queryEachDrip = function queryEachDrip(){
								//codes to query each drip here
							}
						}
					}
				}
			}
		}
	] );