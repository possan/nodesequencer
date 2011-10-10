//
//
//

C = require('./constants').C;

NotesScreen = function() {
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
	
	var _activate = function(host) {
		_host = host;
		_host.display.lcdPrintAt( 1, 1, 'PATTERN EDITOR' );
	};
	
	var _handleButton = function(id) {
			
			var trk = _host.song.getTrack( _host.state.currenttrack );
			var pat = trk.getPattern( _host.state.currentpattern );
				
			if( id == C.Keys.KNOB0_UP ) { _host.state.currentnote ++; if( _host.state.currentnote > 48 ) _host.state.currentnode = 36; }
			if( id == C.Keys.KNOB0_DN ) { _host.state.currentnote --; if( _host.state.currentnote < 36 ) _host.state.currentnode = 48; }

			if( id == C.Keys.KNOB1_UP ) { trk.gate ++; if( trk.gate > 127 ) trk.gate = 127; }
			if( id == C.Keys.KNOB1_DN ) { trk.gate --; if( trk.gate < 1 ) trk.gate = 1; }


			if( id == C.Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == C.Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id == C.Keys.KNOB3_UP ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == C.Keys.KNOB3_DN ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }
			
			if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ){
				var stpobj = pat.getStep( id - C.Keys.PAD0 );
				var oldnote = stpobj.getNote( _host.state.currentnote );
				if( oldnote != null )
					stpobj.clearNote( _host.state.currentnote );
				else
					stpobj.addNote( _host.state.currentnote, 100 );
		}
	}; 
	
	var _update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
		var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
		var trk = _host.song.getTrack( _host.state.currenttrack );
		var pat = trk.getPattern( _host.state.currentpattern );
		for( var j=0; j<16; j++ ){
			var stp = pat.getStep( j );
			var oldnote = stp.getNote( _host.state.currentnote );
			_host.display.leds[ C.Leds.PAD0 + j ] = (oldnote != null);
		}		
		_host.display.lcdPrintAt( 1, 3, 'NOTE' );
		_host.display.lcdPrintAt( 6, 3, 'GATE' );
		_host.display.lcdPrintAt( 11, 3, 'TRAK' );
		_host.display.lcdPrintAt( 16, 3, 'PATT' );
		_host.display.lcdPrintAt( 1, 4, _getNoteName( _host.state.currentnote, trk.type )  + '  ' );
		_host.display.lcdPrintAt( 6, 4, trk.gate + ' ' );
		_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack + '  ' );
		_host.display.lcdPrintAt( 16, 4, _host.state.currentpattern + '  ' );
		if( pp == _host.state.currentpattern && trk.enabled && pat.enabled )
			_host.display.leds[C.Leds.PAD0+ps] = !_host.display.leds[C.Leds.PAD0+ps];
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
	repo.push( { name: 'mode0', factory: function(){ return new NotesScreen(); } } );
};




