drip8
	.directive( "profile" , [
		"$http",
		"Video",
		function directive ( $http , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.profile = { };
					scope.featuredDrip = "1ReuOnKSi0s";

					scope.getUserInfo = function getUserInfo ( ) {
						$http.get( "/api/user" )
						.success( function ( response ) {
							scope.profile = response.data;
						} );
					};

					scope.featured = function featured ( ) {
						return Video.videoSource( scope.featuredDrip );
					};

					scope.getUserInfo( );
				}
			}
		}
	] );