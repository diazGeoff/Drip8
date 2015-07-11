var gulp = require( "gulp" );
var uglify = require( "gulp-uglify" );
var concat = require( "gulp-concat" );
var rename = require( "gulp-rename" );
var sourcemap = require( "gulp-sourcemaps" );

gulp.task( "default" , [		
		"link-script"
	] );

gulp.task( "link-script" , 
	function linkScript ( ) {
		return gulp
				.src( [ "app/assets/javascripts/scripts/app.js" 
						, "app/assets/javascripts/scripts/*._.js" ] )
				.pipe( sourcemap.init( ) )
				.pipe( concat( "../app.js" ) )
				.pipe( rename( {dirname: ""} ) )
				.pipe( gulp.dest( "app/assets/javascripts" ) )
				.pipe( uglify( ) )
				.pipe( rename( "app.min.js" ) )
				.pipe( sourcemap.write( "./" ) )
				.pipe( gulp.dest( "app/assets/javascripts" ) );
	} );