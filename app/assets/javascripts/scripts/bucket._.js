drip8
	.directive( "bucket" , [
		function directive ( ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {

					scope.buckets = [ "Who I am" , "What I do" , "What I am proud of" ];
				}
			}
		}
	] );