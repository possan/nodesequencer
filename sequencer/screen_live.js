//
//
//

C = require('./constants').C;

LiveNotesScreen = function() {
	var _host = null;
	var redrumkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2' ,'FX3','FX4','HH', 'HH2','FX5' ];
	var kongkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2' ,'FX3' ,'HH' ,'HH2', 'FX4', 'FX5', 'FX6', 'FX7', 'FX8', 'FX9', 'F10', 'F11' ];
	var drumkeys = redrumkeys; 
	var keyprefix = [ 'C-', 'C#', 'D-', 'D#' ,'E-' ,'F-' ,'F#', 'G-', 'G#', 'A-' ,'A#' ,'B-' ];
	var _getNoteName = function(id,mode) {
		if( mode == 'drum' ) {
			var k = id - 36;
			if( k >= 0 && k < drumkeys.length )
				return drumkeys[k];
			// return "#"+id;
		}
		var o = Math.floor(id / 12);
		var k = id % 12;
		return keyprefix[k]+''+o;
	};
	
	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('LIVE PADS');
	};
	
	var _lastkey = -1;
	var _lasttimer = 0;
	
	var _handleButton = function(id) {		
		var trk = _host.song.getTrack( _host.state.currenttrack );
		
		if( id == C.Keys.KNOB1_UP ) trk.gate = Utils.addclamp( trk.gate, 1, 0, 127 );
		if( id == C.Keys.KNOB1_DN ) trk.gate = Utils.addclamp( trk.gate, -1, 0, 127 );
		
		if( id == C.Keys.KNOB2_UP ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, 1, 0, 15 );
		if( id == C.Keys.KNOB2_DN ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, -1, 0, 15 );

		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ) {
			_host.sequencer.queueNote( trk.channel, id+36, 100, trk.gate );
			_lastkey = id+36;
			_lasttimer = 20;
		}
	}; 
	
	var _update = function() {
		var trk = _host.song.getTrack( _host.state.currenttrack );
		for( var j=0; j<16; j++ ) {
			_host.display.leds[ C.Leds.PAD0 + j ] = (_lastkey == j+36 && _lasttimer > 0 );
		}		

		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1, 1, 'LIVE PAD' );
		_host.display.lcdPrintAt( 6, 3, 'GATE' );
		_host.display.lcdPrintAt( 11, 3, 'TRAK' );
		if( _lastkey > 0 && _lasttimer > 0 ) {
			_host.display.lcdPrintAt( 1, 3, 'NOTE' );
			_host.display.lcdPrintAt( 1, 4, _getNoteName( _lastkey, trk.type )  + '  ' );}

		_host.display.lcdPrintAt( 6, 4, ''+trk.gate );
		_host.display.lcdPrintAt( 11, 4, ''+_host.state.currenttrack );

		if( _lasttimer > 0 )
			_lasttimer --;
		else
			_lastkey = 0;
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
	repo.push( { name: 'mode0', factory: function(){ return new LiveNotesScreen(); } } );
};




