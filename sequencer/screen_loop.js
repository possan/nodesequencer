//
//
//

Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;
 
exports.LoopScreen = function(opts) {	
	var _host = null;
	return {

		activate: function(host) {
			_host = host;
			if( _host.subscreen % 2 == 0 )
				_host.display.lcdPrintAt( 1,1, 'PATTERNLOOP STRT' );
			else
				_host.display.lcdPrintAt( 1,1, 'PATTERNLOOP END' );
			// _host.display.lcdPrintAt( 1,2, 'Click to set' );
		},

		handleButton: function(id) {
			var strk = _host.song.getTrack( _host.state.currenttrack );
			var sstp = strk.getPattern( _host.state.currentpattern );
			if( id == Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id == Keys.KNOB3_UP ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == Keys.KNOB3_DN ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }
			
			if( id == Keys.KNOB0_UP ) {
				sstp.start ++;
				if( sstp.start > 15 )
					sstp.start = 15;
			}
			
			if( id == Keys.KNOB0_DN ) {
				sstp.start --;
				if( sstp.start < 0 )
					sstp.start = 0;
			}
			
			if( id == Keys.KNOB1_UP ) {
				sstp.end ++;
				if( sstp.end > 15 )
					sstp.end = 15;
			}
			
			if( id == Keys.KNOB1_DN ) {
				sstp.end --;
				if( sstp.end < 0 )
					sstp.end = 0;
			}	
			
			if( id >= Keys.PAD0 && id <= Keys.PAD15 ){
				if( _host.subscreen % 2 == 0 )
					sstp.start = id - Keys.PAD0;
				else
					sstp.end = id - Keys.PAD0;
			}
			
			if( sstp.start >= sstp.end ) sstp.end = sstp.start;
			else if( sstp.end <= sstp.start ) sstp.start = sstp.end;
		}, 
		
		update: function() {

			var s = _host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 4;

			var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );

			var strk = _host.song.getTrack( _host.state.currenttrack );
			var sstp = strk.getPattern( _host.state.currentpattern );

			for(var i=0; i<16; i++ ) {
				_host.display.leds[Leds.PAD0+i] = ( i >= sstp.start && i <= sstp.end );
			}
				
			/*
			if( b == 0 ) {
				if( _host.subscreen % 2 == 0 ) { // start
					_host.display.leds[ Leds.PAD0+sstp.start ] = !_host.display.leds[ Leds.PAD0+sstp.start ];
				} else { // end
					_host.display.leds[ Leds.PAD0+sstp.end ] = !_host.display.leds[ Leds.PAD0+sstp.end ];
				}		
			}
			*/
			
			if( pp == _host.state.currentpattern && sstp.enabled && strk.enabled )
				_host.display.leds[ Leds.PAD0+ps ] = !_host.display.leds[ Leds.PAD0+ps ];
				
			_host.display.lcdPrintAt( 1, 3, 'STRT' );
			_host.display.lcdPrintAt( 6, 3, 'END' );
			_host.display.lcdPrintAt( 11, 3, 'TRAK' );
			_host.display.lcdPrintAt( 16, 3, 'PATT' );
			
			_host.display.lcdPrintAt( 1, 4, sstp.start + ' ' );
			_host.display.lcdPrintAt( 6, 4, sstp.end + ' ' );
			_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack+' ' );
			_host.display.lcdPrintAt( 16, 4, _host.state.currentpattern+' ' );
		}
	};
}; 
