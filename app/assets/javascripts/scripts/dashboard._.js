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
										console.log( "***************************deleted" , taskResponse[ index ].drip );
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