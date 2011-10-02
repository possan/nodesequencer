//
//
//

Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;
 
exports.MixScreen = function() {
	var _host = null;
	return {
		activate: function(host) {
			_host = host;
			// _host.display.lcd = '';
			_host.display.lcdPrintAt( 1, 1, 'Mixer' );
			_host.display.lcdPrintAt( 1, 2, 'Click to mute' );
			_host.display.lcdPrintAt( 15, 3, 'FINE ' );
			_host.display.lcdPrintAt( 10, 3, 'BPM ' );
		},
		
		handleButton: function( id ) {
			if( id >= Keys.PAD0 && id <= Keys.PAD15 ) {
				var strk = _host.song.getTrack( id - Keys.PAD0 );
				strk.enabled = !strk.enabled;
				return;
			}
			var bpm = _host.sequencer.player.getBPM();
			if( id == Keys.KNOB3_UP ) bpm += 0.1;
			if( id == Keys.KNOB2_UP ) bpm += 1.0;
			if( id == Keys.KNOB3_DN ) bpm -= 0.1;
			if( id == Keys.KNOB2_DN ) bpm -= 1.0;
			_host.sequencer.player.setBPM( bpm );
		},
		 
		update: function() {
			var bpm = _host.sequencer.player.getBPM();
			//	_host.display.lcd = 'Mixer\nClick to mute\nBPM: '+Math.round(bpm,2);
			
			_host.display.lcdPrintAt( 10, 4, (Math.round(bpm*10)/10)+'  ' );
			
			var s = _host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 4;
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
			for( var j=0; j<16; j++ ) {
				var pp = _host.sequencer.getPlayingPattern( j );
				var strk = _host.song.getTrack( j );
				_host.display.leds[ Leds.PAD0 + j ] = strk.enabled;
				if( pp != -1 && b == 0 )
					_host.display.leds[ Leds.PAD0 + j ] = false;
			}
		}
	};
};
