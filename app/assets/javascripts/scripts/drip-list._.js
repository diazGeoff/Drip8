drip8
	.directive( "dripList" , [
		"$http",
		"Video",
		"$rootScope",
		function directive ( $http , Video , $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {

					var ids = attributeSet.dripList.split( "-" );
					scope.drips = [ ];	

					scope.dripListing = function dripListing ( ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"dripbucket_id": ids[0],
							"user_id": ids[1]
						} )
						.success( function ( response ) {
							scope.drips = response.drips;
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

					scope.showVideo = function showVideo ( link , id ) {
						$( "#videoLink" ).modal( "show" );
						$rootScope.$broadcast( "video-source" , link , id );
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