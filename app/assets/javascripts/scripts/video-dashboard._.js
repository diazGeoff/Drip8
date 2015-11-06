drip8
	.directive( "videoDashboard" , [
		"$http",
		"Video",		
		function directive ( $http , Video ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {
					scope.videoSrc = Video.videoSource( attributeSet.videoSource.split( "v=" )[1] );
				}
			}
		}
	] );