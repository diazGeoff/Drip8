drip8
	.directive( "videoDashboard" , [
		"$http",
		"Video",
		"$rootScope",
		"$sce",
		function directive ( $http , Video , $rootScope , $sce ) {
			return {
				"restrict": "A",
				"scope": {
					"videoSrc": "="
				},
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSrc = $sce.trustAsResourceUrl( scope.videoSrc );		
				}
			}
		}
	] );