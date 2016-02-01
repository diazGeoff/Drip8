drip8
	.directive( "bucket" , [
		"$rootScope",
		"$http",
		'profileService',
		'dripListService',
		function directive ( $rootScope , $http , profileService , dripListService ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , elemenet , attributeSet ) {
					scope.profileData = { };

					scope.buckets = [ ];
					////console.log( localStorage.userProfile );
					scope.newDrip = function newDrip ( id , bucketName ) {
						$rootScope.$broadcast( "drip-new" , id , bucketName );
					};

					scope.getDrip = function getDrip ( id ) {
						$http.post( "/api/read_drips_by_bucket_and_user" , {
							"user_id": scope.profileData.id,
							"dripbucket_id": id
						} )
						.success( function ( response ) {
							//console.log( response );
						} );
					};

					scope.description= function description( desc ){
						return desc != null;
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
							if( profile.id == '1' ){

								if( scope.profileData.id == '1' ){
									scope.buckets.splice( 0 , 3 );
									//console.log( scope.buckets );

									for( var index = 0; index < scope.buckets.length; index++ ){
										if( scope.buckets[ index ].name == "Dota 2" || scope.buckets[ index ].name ==  "EG Dota 2" || scope.buckets[ index ].name == "Secret Dota 2" || scope.buckets[ index ].name == "Alliance Dota 2" || scope.buckets[ index ].name == "Na'Vi Dota 2" || scope.buckets[ index ].name == "Sumail Dota 2" ){
											scope.buckets.splice( index , 1 );
											index--;
										}
									}
								}
								
							}
						} );
					};
					scope.rename = function rename ( drip , target ) {						
						////console.log( drip , target );
					};
					
					var createAsyncTask = function createAsyncTask ( taskArray , setting ) {
						var tasks = [ ];

						taskArray.forEach( function ( e ) {
							//console.log( e )
							if( setting == 'public' ){
								setting = e.state
							}else{
								setting = 'profile only'
							}
							tasks.push( function ( callback ) {
								$http.post( "/api/update_drip_state" , { 
									"drip_id": e.id,
									"state": setting  
								} )
								.success( function ( response ) {
									callback( null , response );
								} );
							} );
						} );
						return tasks;
					};

					scope.setting = function setting ( drips , setting , target , id ) {						
						////console.log( drips , setting , target );

						switch( target ){

							case 'drip':
								$http.post( '/api/update_drip_state' , {
									"drip_id": drips.id,
									"state": setting 
								})
								.success( function( response ){
									//console.log( "New" , response );
									scope.$broadcast( "drips-reload" );
								} )
								break;
							case 'bucket':
								//console.log( id );
								var dripList = dripListService.setDripList();
								var list = dripList[ id ];
								//console.log( list )

								var asyncTasks = createAsyncTask( list , setting );
								async
									.parallel( asyncTasks , function ( err , taskResponse ) {
										//console.log( taskResponse );
										scope.$broadcast( "drips-reload" );
									} );
						}
						
					};
					scope.deleteDrip = function deleteDrip ( drip , target ) {						
						//console.log( drip , target );
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
							//console.log( "profile data below" )
							//console.log( scope.profileData )
							scope.getAllBucket( );
						} );						
				}
			}
		}
	] );

drip8
	.directive( "ifBucket" , [
		"$http",
		function directive ( $http ) {
			return {
				"restrict": "A",
				"scope": true,
				"link": function onLink ( scope , element , attributeSet ) {					

					console.log( scope.$parent.bucketName );
				}
			}
		}
	] );