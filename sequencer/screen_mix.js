//
//
//

C = require('./constants').C;
 
MixScreen = function() {
	
	var _host = null;
	
	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('MIXER');
	};
		
	var _handleButton = function( id ) {
		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ) {
			var strk = _host.song.getTrack( id - C.Keys.PAD0 );
			strk.enabled = !strk.enabled;
			return;
		}
		var bpm = _host.sequencer.player.getBPM();
		if( id == C.Keys.KNOB3_UP ) bpm += 0.1;
		if( id == C.Keys.KNOB2_UP ) bpm += 1.0;
		if( id == C.Keys.KNOB3_DN ) bpm -= 0.1;
		if( id == C.Keys.KNOB2_DN ) bpm -= 1.0;
		_host.sequencer.player.setBPM( bpm );
	};
	 
	var _update = function() {
		var bpm = _host.sequencer.player.getBPM();
		//	_host.display.lcd = 'Mixer\nClick to mute\nBPM: '+Math.round(bpm,2);

		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1, 1, 'Mixer' );
		_host.display.lcdPrintAt( 1, 2, 'Click to mute' );
		_host.display.lcdPrintAt( 15, 3, 'FINE ' );
		_host.display.lcdPrintAt( 10, 3, 'BPM ' );
		_host.display.lcdPrintAt( 10, 4, (Math.round(bpm*10)/10)+'  ' );
			
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor( s ) % 4;
		var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
		for( var j=0; j<16; j++ ) {
			var pp = _host.sequencer.getPlayingPattern( j );
			var strk = _host.song.getTrack( j );
			_host.display.leds[ C.Leds.PAD0 + j ] = strk.enabled;
			if( pp != -1 && b == 0 )
				_host.display.leds[ C.Leds.PAD0 + j ] = false;
		}
	};
		
	return {
		handleEvent: function(event) {
			switch(event.type) {
				case C.Events.BUTTON_CLICK: _handleButton(event.button); break;
				case C.Events.UI_ACTIVATE: _activate(event.host); break;
				case C.Events.UI_UPDATE: _update(); break;
			}
		}
	};
};

exports.registerScreens = function( repo ) {
	repo.push( { name: 'mode3', factory: function() { return new MixScreen(); } } );
};



