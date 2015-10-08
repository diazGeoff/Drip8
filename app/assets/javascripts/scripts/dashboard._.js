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
								var video_id = link.split( 'v=' )[1];
								scope.video_id = video_id;
								var ampersandPosition = video_id.indexOf( '&' );
								if ( ampersandPosition != -1 ) {
								  video_id = video_id.substring( 0 , ampersandPosition );
								}
								// console.log( link );
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