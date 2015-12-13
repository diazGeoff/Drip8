drip8
	.service( "dripListService" , [
			function(){
				var dripList = [];

				return {
					// takes id of dripBucket and sets drips in
					setDripList: function setDripList( id , credentials ){
						if( credentials ){
							dripList[ id ] = credentials;
						}else{
							return dripList
						}
					}
				}
			}
		] );

drip8
	.directive( "dripList" , [
		"$http",
		"Video",
		"$rootScope",
		'dripListService',
		function directive ( $http , Video , $rootScope , dripListService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {

					var ids = attributeSet.dripList.split( "-" );
					console.log( ids[ 2 ] );
					scope.drips = [ ];

					var dripFilter = function dripFilter ( array ){
						var newDripArray = [];

						array.forEach( function( e ) {
							if( e.state != 'deleted' ){
								newDripArray.push( e );
							}
						} );
						return newDripArray;
					};

					scope.dripListing = function dripListing ( ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"dripbucket_id": ids[0],
							"user_id": ids[1]
						} )
						.success( function ( response ) {
							scope.drips = response.drips;
							dripListService.setDripList( ids[ 2 ] , scope.drips );
							
							scope.drips = dripFilter( scope.drips );
							$("#welcome").modal("hide");
						} );
					};

					scope.linkUri = function linkUri ( link , service ) {
						var video_id = link.split( 'v=' )[1];
						var ampersandPosition = video_id.indexOf( '&' );
						if ( ampersandPosition != -1 ) {
						  video_id = video_id.substring( 0 , ampersandPosition );
						}
						if ( service == "thumb" ) {
							return Video.thumbnail( video_id );
						} else {
							return Video.videoSource( video_id );
						}	
					};

					scope.showVideo = function showVideo ( link , drip ) {
						$( "#videoLink" ).modal( "show" );
						$rootScope.$broadcast( "video-source" , link , drip );
					};

					scope.dripListing( );

					scope.$on( "drips-reload" , 
						function ( ) {
							scope.dripListing( );
						} );
				}
			}
		}
	] );