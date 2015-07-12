drip8
	.directive( "bucket" , [
		"$rootScope",
		function directive ( $rootScope ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {

					scope.buckets = [ 
						{
							"title": "Who I am",
							"id": "1"
						} , 
						{
							"title": "What I do",
							"id": "2"
						} , 
						{
							"title": "What I am proud of",
							"id": "3"
						} 
					];

					scope.newDrip = function newDrip ( id ) {
						$rootScope.$broadcast( "drip-new" , id );
					};
				}
			}
		}
	] );