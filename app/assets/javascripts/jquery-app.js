$( document ).ready( function ( ) {
	var maxWidth = function maxWidth ( ) {
		$( "#main-container" ).css( "max-height" , ( window.innerHeight - 70 ) + "px" );
	};

	maxWidth( );

	$(window).resize( maxWidth );
} );