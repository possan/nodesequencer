//
//
//

Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;
 
exports.PatternsScreen = function(opts) {
	var _host = null;
	return {
		activate: function(host) {
			_host = host;
			_host.display.lcdPrintAt( 1, 1, 'ENABLE PATTERNS' );
		},
		handleButton: function(id) {
			if( id == Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id >= Keys.PAD0 && id <= Keys.PAD15 ) {
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( id-Keys.PAD0 );
				sstp.enabled = !sstp.enabled;
				// _host.state.currentpattern = id;
			}
		},
		update: function() {
			var s = _host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 4;
			var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
			for(var i=0; i<16; i++ ) {	
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( i );
				_host.display.leds[Leds.PAD0+i] = sstp.enabled;
			}
			var ps = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			
		//	_host.display.lcd = 'Enabled pattern\nClick to toggle\nTrack #'+_host.state.currenttrack+' '+ps;
			
			// _host.display.lcdPrintAt( 1, 3, 'STRT' );
			// _host.display.lcdPrintAt( 6, 3, 'END' );
			_host.display.lcdPrintAt( 11, 3, 'TRAK' );
			// _host.display.lcdPrintAt( 16, 3, 'PATT' );
			
			// _host.display.lcdPrintAt( 1, 4, sstp.start + ' ' );
			// _host.display.lcdPrintAt( 6, 4, sstp.end + ' ' );
			_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack+' ' );
			// _host.display.lcdPrintAt( 16, 4, _host.state.currentpattern+' ' );
			
			if( ps != -1 && b == 0 )
				_host.display.leds[Leds.PAD0+ps] = !_host.display.leds[Leds.PAD0+ps];
		}
	};
};
	