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
			_host.display.lcd = 'Patterns enable';
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
			_host.display.lcd = 'Enabled pattern\nClick to toggle\nTrack #'+_host.state.currenttrack+' '+ps;
			if( ps != -1 && b == 0 )
				_host.display.leds[Leds.PAD0+ps] = !_host.display.leds[Leds.PAD0+ps];
		}
	};
};
	