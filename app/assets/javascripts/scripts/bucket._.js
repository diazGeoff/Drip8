drip8
	.directive( "bucket" , [
		"$rootScope",
		"$http",
		'profileService',
		function directive ( $rootScope , $http , profileService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];
					//console.log( localStorage.userProfile );
					scope.newDrip = function newDrip ( id , bucketName ) {
						$rootScope.$broadcast( "drip-new" , id , bucketName );
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
							var profile = profileService.setProfile();
							if( scope.profileData.id == '1' || profile.id == '1' ){
								scope.buckets.splice( 0 , 3 );
								//console.log( scope.buckets );
							}
						} );
					};
					scope.rename = function rename ( drip , target ) {						
						//console.log( drip , target );
					};
					scope.setting = function setting ( drips , setting , target ) {						
						console.log( drips , setting , target );

						switch( target ){

							case 'drip':
								$http.post( '/api/update_drip_state' , {
									"drip_id": drip.id,
									"state": setting 
								})
								.success( function( response ){
									console.log( drips );
								} )
								break;
							case 'bucket':
								console.log( scope.drips );
						}
						
					};
					scope.deleteDrip = function deleteDrip ( drip , target ) {						
						console.log( drip , target );
					};				

					scope.settingDropdown = function settingDropdown( name ){
						var profile = profileService.setProfile() // actual profile
						if( scope.profileData.id != profile.id ){
							return false;
						}else{
							switch( name ){

								case 'who I am':
									return false;
									break;
								case 'what I do':
									return false;
									break;
								case 'what I am proud of':
									return false;
									break;
								default:
									return true;
							}
						}
					};


					scope.$on( "profile-data" , 
						function ( evt , profile ) {
							scope.profileData = JSON.parse( localStorage.userProfile );// visited profile 
							console.log( "profile data below" )
							console.log( scope.profileData )
							scope.getAllBucket( );
						} );						
				}
			}
		}
	] );