drip8
	.directive( "feature" , [
		"$http",
		function directive ( $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {					

					var ids = attributeSet.feature.split( "-" );

					element.bind( "click" , 
						function ( ) {
							$http.post( "/api/new_featured" , {
								"user_id": ids[0],
								"drip_id": ids[1]
							} )
							.success( function ( response ) {
								window.location.reload( );
							} );
						} );
				}
			}
		}
	] );