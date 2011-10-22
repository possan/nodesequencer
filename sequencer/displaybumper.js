
exports.DisplayBumper = function( opts ) {

	var _message = "";
	var _message2 = "";
	var _timer = 0;

	var ret = {
		
		setMessage: function( message, message2 ) {
			_message = message || '';	
			_message2 = message2 || '';	
			_timer = 15;
		},
		
		update: function(_host) {	
			if( _timer <= 0 )
				return;
			
			_host.display.lcdClear();
			_host.display.lcdPrintAt( 2, 2, _message );
			_host.display.lcdPrintAt( 2, 3, _message2 );
			//	_host.display.lcdPrintAt( 1, 1, ''+_timer+' ' );
			_timer --;
		}
	};
	
	if( opts )
		ret.setMessage( opts.message, opts.message2 );
	
	return ret;
};