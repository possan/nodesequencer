//
//
//

C = require('./constants').C;

TrackConfigScreen = function() {
	
	var _host = null;

	var _par = 0;
		
	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('TRACK SETTINGS');
	};
	
	var _handleButton = function( id ) {

		var strk = _host.song.getTrack( _host.state.currenttrack );

		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ) { _host.state.currenttrack = id; }
		
		if( id == C.Keys.KNOB0_UP ) _par = Utils.addmod( _par, 1, 0, 3 );
		if( id == C.Keys.KNOB0_DN ) _par = Utils.addmod( _par, -1, 0, 3 );
		
		if( _par == 0 ) {
			if( id == C.Keys.KNOB1_UP ) { 
				switch( strk.type ){
					case 'synth': strk.type = 'monosynth'; break;
					case 'monosynth': strk.type = 'drum'; break;
					case 'drum': strk.type = 'synth'; break;
				}
			}
		}
		else  if( _par == 1 ) {
			if( id == C.Keys.KNOB1_UP ) strk.channel = Utils.addclamp( strk.channel, 1, 0, 15 );
			if( id == C.Keys.KNOB1_DN ) strk.channel = Utils.addclamp( strk.channel, -1, 0, 15 );
		}
		else  if( _par == 2 ) {
			if( id == C.Keys.KNOB1_UP ) strk.gate = Utils.addclamp( strk.gate, 1, 0, 127 );
			if( id == C.Keys.KNOB1_DN ) strk.gate = Utils.addclamp( strk.gate, -1, 0, 127 );
		}
		else  if( _par == 3 ) {
			if( id == C.Keys.KNOB1_UP || id == C.Keys.KNOB1_DN ) strk.advance = !strk.advance;
		}
		
		if( id == C.Keys.KNOB2_UP ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, 1, 0, 15 );
		if( id == C.Keys.KNOB2_DN ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, -1, 0, 15 );
	};
	 
	var _update = function() {

		var strk = _host.song.getTrack( _host.state.currenttrack );

		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1, 4, 'PAR#' );
		_host.display.lcdPrintAt( 5, 4, 'VALU' );
		_host.display.lcdPrintAt( 10, 4, 'TRAK' );
		
		if( _par == 0 ) {
			_host.display.lcdPrintAt( 1, 1, 'Device type:' );
			switch( strk.type ){
				case 'synth':
					_host.display.lcdPrintAt( 1, 2, 'Poly. synth' );
					break;
				case 'monosynth':
					_host.display.lcdPrintAt( 1, 2, 'Mono. synth' );
					break;
				case 'drum':
					_host.display.lcdPrintAt( 1, 2, 'Drummachine' );
					break;
				default:
					_host.display.lcdPrintAt( 1, 2, 'Unknown' );
					break;
			}

		} else if( _par == 1 ) {
			// MIDI CHANNEL
			_host.display.lcdPrintAt( 1, 1, 'MIDI Channel:' );
			_host.display.lcdPrintAt( 1, 2, ''+strk.channel );			
		} else if( _par == 2 ) {
			// GATE
			_host.display.lcdPrintAt( 1, 1, 'Gate length:' );
			_host.display.lcdPrintAt( 1, 2, ''+strk.gate );
		} else if( _par == 3 ) {
			_host.display.lcdPrintAt( 1, 1, 'Auto advance:' );
			_host.display.lcdPrintAt( 1, 2, strk.advance ? "Yes": "No" );
		}

		_host.display.lcdPrintAt( 10, 4, ''+_host.state.currenttrack );
		for( var j=0; j<16; j++ ) {
			_host.display.leds[ C.Leds.PAD0 + j ] = _host.state.currenttrack == j;
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
	repo.push( { name: 'mode3', factory: function() { return new TrackConfigScreen(); } } );
};



