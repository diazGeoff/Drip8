drip8
	.directive( "bucket" , [
		"$rootScope",
		"$http",
		function directive ( $rootScope , $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];
					console.log( localStorage.userProfile );
					scope.newDrip = function newDrip ( id ) {
						$rootScope.$broadcast( "drip-new" , id );
					};

					scope.getDrip = function getDrip ( id ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"user_id": scope.profileData.id,
							"dripbucket_id": id
						} )
						.success( function ( response ) {
							console.log( response );
						} );
					};

					scope.newBucket = function newBucket ( bucket ) {
						$( "#createDripBoardBox" ).modal( "hide" );
						$http.post( "/api/add_bucket" , {
							"bucket": {
								"user_id": scope.profileData.id,
								"name": bucket.name,
								"state": bucket.state
							}
						} ).success( function ( response ) {							
							window.location.reload( );
						} );
					};

					scope.getAllBucket = function getAllBucket ( ) {						
						$http.post( "/api/read_all_bucket_by_user" , {
							"user_id": scope.profileData.id
						} )
						.success( function ( response ) {							
							scope.buckets = response.buckets;
						} );
					};
					scope.rename = function rename ( drip , target ) {						
						console.log( drip , target );
					};
					scope.setting = function setting ( drip , setting , target ) {						
						console.log( drip , setting , target );
					};
					scope.deleteDrip = function deleteDrip ( drip , target ) {						
						console.log( drip , target );
					};				

					scope.$on( "profile-data" , 
						function ( evt , profile ) {
							scope.profileData = JSON.parse( localStorage.userProfile );
							console.log( "profile data below" )
							console.log( scope.profileData )
							scope.getAllBucket( );
						} );					
				}
			}
		}
	] );