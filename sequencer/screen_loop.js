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
			_host.display.lcd = 'Tempo';
		},
		handleButton: function(id) {

			if( id == Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id == Keys.KNOB3_UP ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == Keys.KNOB3_DN ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }

			if( id >= Keys.PAD0 && id <= Keys.PAD15 ){
				
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( _host.state.currentpattern );

				// set start or end
				if( _host.subscreen % 2 == 0 ) { // start
					sstp.start = id - Keys.PAD0;
				} else {
					sstp.end = id - Keys.PAD0;
				}	
				if( sstp.start >= sstp.end )
					sstp.end = sstp.start;
				else if( sstp.end <= sstp.start )
					sstp.start = sstp.end;
			}


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
				
			if( b == 0 ) {
				if( _host.subscreen % 2 == 0 ) { // start
					_host.display.leds[ Leds.PAD0+sstp.start ] = !_host.display.leds[ Leds.PAD0+sstp.start ];
				} else { // end
					_host.display.leds[ Leds.PAD0+sstp.end ] = !_host.display.leds[ Leds.PAD0+sstp.end ];
				}		
			}
			
			if( pp == _host.state.currentpattern )
				_host.display.leds[ Leds.PAD0+ps ] = !_host.display.leds[ Leds.PAD0+ps ];
			
			if( _host.subscreen % 2 == 0 ) {
				_host.display.lcd = 'Patternloop start\nClick to set\nTrack #'+_host.state.currenttrack+' Pat #'+_host.state.currentpattern;
			} else {
				_host.display.lcd = 'Patternloop end\nClick to set\nTrack #'+_host.state.currenttrack+' Pat #'+_host.state.currentpattern;
			}
		}
	};
}; 
