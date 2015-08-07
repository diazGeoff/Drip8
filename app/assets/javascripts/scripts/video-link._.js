drip8
	.directive( "videoLink" , [
		function  directive ( ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSource;

					$( "#videoLink" ).on( "hidden.bs.modal" , 
						function ( ) {
							scope.$apply( function ( ) {
								scope.videoSource = "";
							} );
						} );

					scope.$on( "video-source" , 
						function ( evt , src ) {							
							scope.videoSource = src;
						} );
				}
			}
		}
	] );