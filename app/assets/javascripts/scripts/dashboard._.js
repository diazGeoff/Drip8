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