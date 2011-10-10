//
//
//

C = require('./constants').C;


PatternsScreen = function(opts) {
	var _host = null;
	return {
		
		activate: function(host) {
			_host = host;
			_host.display.lcdPrintAt( 1, 1, 'ENABLE PATTERNS' );
		},
		
		handleButton: function(id) {
			if( id == C.Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == C.Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ) {
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( id-C.Keys.PAD0 );
				sstp.enabled = !sstp.enabled;
				// _host.state.currentpattern = id;
			}
		},
		
		handleEvent: function(event) {
			switch(event.type){
				case C.Events.BUTTON_CLICK: this.handleButton(event.button); break;
				case C.Events.UI_ACTIVATE: this.activate(event.host); break;
				case C.Events.UI_UPDATE: this.update(); break;
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
				_host.display.leds[C.Leds.PAD0+i] = sstp.enabled;
			}
			var ps = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
		
			_host.display.lcdPrintAt( 11, 3, 'TRAK' );
			_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack+' ' );
			
			if( ps != -1 && b == 0 )
				_host.display.leds[C.Leds.PAD0+ps] = !_host.display.leds[C.Leds.PAD0+ps];
		}
	};
};
	
exports.registerScreens = function( repo ) {
	repo.push( { name: 'mode2', factory: function(){ return new PatternsScreen(); } } )
};

