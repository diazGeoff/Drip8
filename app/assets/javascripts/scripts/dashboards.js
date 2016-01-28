drip8
	.directive( "dripDashboards" , [
		"$http",
		'$rootScope',
		"$window",
		function directive ( $http , $rootScope , $window ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.drips = [ ];
					scope.ready = false;
					scope.category = $window.localStorage.getItem( "category" ) || "motivation";
					scope.lastId = "dont stop";
					scope.asyncTasksArray = [];
					scope.tab = 1;

					//console.log( scope.category );
					//console.log( "init" );
					var counter = 0;

					console.log( "localStorage" , $window.localStorage.getItem( "category" ) );
					function dripEach( index, drips , lastId ){
						$http.post( "/api/drip_each" , { "drip_id": index } )
								.success( function ( responseEach ){
									if( responseEach.drip.state != scope.category ){
											dripEach( index-1 , drips );
									}
									if( responseEach.drip != null && responseEach.drip.state == scope.category ){
										drips.push( responseEach );
										//console.log( "pushed" )
									}
									if( lastId == 0 ){
										//console.log( "stop na" )
										scope.lastId = 'stop';
										//console.log( scope.lastId );
									}
									return responseEach;
								} );
					}

					function asyncArray( index, array , lastId ){
						$http.post( "/api/drip_each" , { "drip_id": index } )
								.success( function ( responseEach ){
									//console.log( responseEach );
									scope.category = $window.localStorage.getItem( "category" ) || "motivation";
									if( responseEach.drip.state != scope.category ){
											console.log( "dili parehas" , index-1 );
											console.log( "dili parehas" , array );
											asyncArray( index-1 , array );
									}
									if( responseEach.drip != null && responseEach.drip.state == scope.category ){
										array.push( responseEach.drip.id );
										//console.log( "parehas mi YEAH" )
										//console.log( "pushed" , responseEach.drip.id )
										if( array.length < 3 ){
											asyncArray( index-1 , array );
										}else{
											$rootScope.$broadcast( "async-yeah" , array )
										}
									}
									if( lastId == 0 ){
										//console.log( "stop na" )
										scope.lastId = 'stop';
										//console.log( scope.lastId );
									}
								} );
					}


					$rootScope.$on( "async-yeah" , function( evt , data ){
						
							//console.log( data )
							//console.log( "asynctasks", scope.asyncTasksArray );
							var asyncTasks = createAsyncTask( data );
							async
								.parallel( asyncTasks , function ( err , taskResponse ) {
									for( var index = 0 ; index < taskResponse.length ; index++ ){
										if( taskResponse[ index ].drip == null || taskResponse[ index ].drip.state != scope.category ){
											//console.log( "***************************deleted" , taskResponse[ index ].drip );
											taskResponse.splice( index , 1 );
										}
										
									}
									scope.drips = taskResponse;
									//console.log( taskResponse );
								} );
						
					} )

					$rootScope.$on( "on-length-finish" , function( evt , data ){
					
						scope.index = data;
						scope.drip_length = data;
						//console.log( data );

						asyncArray( scope.index , scope.asyncTasksArray );
						
						//console.log( "ASYNC GAGO" , scope.asyncTasksArray );
					} )


					$http.get( "/api/drip_length" )
					.success( function ( response ) {

						$rootScope.$broadcast( "on-length-finish" , response.count );
						
					} );
					

					scope.passProfile = function passProfile( profile ){
						localStorage.setItem("userProfile", JSON.stringify( profile ) );
					};
					
					scope.checkThis = function checkThis( num ){
						if( scope.tab == num ){
							//console.log( "&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" )
							return true;
						}else{
							//console.log( "IIIIIIIIIIIIIIIIIIIIIIIIIIIIIII" )
							return false;
						}
						
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
										scope.category = $window.localStorage.getItem( "category" ) || "motivation";
										if( response.drip.state != scope.category ){
											dripEach( response.drip.id-1 , scope.drips , lastId );
										}
										if( response.drip != null && response.drip.state == scope.category ){
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


// async
// 	.parallel( [
// 		function ( callback ) {

// 		},
// 		function ( callback ) {

// 		}, 
// 	] , function doSomething ( err , arr ) {

// 	} );