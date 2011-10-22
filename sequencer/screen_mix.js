//
//
//

C = require('./constants').C;
Utils = require('./utils').Utils;
 
MixScreen = function() {
	
	var _host = null;
	
	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('MIXER');
	};
		
	var _handleButton = function( id ) {
		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ) {
			var strk = _host.song.getTrack( id - C.Keys.PAD0 );
			strk.enabled = !strk.enabled;
			return;
		}

		if( id == C.Keys.KNOB1_DN ) _host.song.shuffle = Utils.addclamp( _host.song.shuffle, 1, 0, 100 );
		if( id == C.Keys.KNOB1_UP ) _host.song.shuffle = Utils.addclamp( _host.song.shuffle, -1, 0, 100 );
		
		if( id == C.Keys.KNOB2_UP ) _host.song.bpm = Math.round( _host.song.bpm + 1 );
		if( id == C.Keys.KNOB2_DN ) _host.song.bpm = Math.round( _host.song.bpm - 1 );

		if( id == C.Keys.KNOB3_UP ) _host.song.bpm += 0.02;
		if( id == C.Keys.KNOB3_DN ) _host.song.bpm -= 0.02;
	};
	 
	var _update = function() {
		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1, 1, 'Mixer' );
		_host.display.lcdPrintAt( 1, 2, 'Click to mute' );
		_host.display.lcdPrintAt( 5, 3, 'SHUF ' );
		_host.display.lcdPrintAt( 15, 3, 'FINE ' );
		_host.display.lcdPrintAt( 10, 3, 'BPM ' );
		_host.display.lcdPrintAt( 10, 4, (Math.round(_host.song.bpm*100)/100)+' ' );
		_host.display.lcdPrintAt( 5, 4, Math.round(_host.song.shuffle)+' ' );
			
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



