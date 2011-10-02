//
//
//

Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;
 

exports.NotesScreen = function() {
	
	var _host = null;
	
	var redrumkeys = [ 'BD', 'SD', 'SD2', 'FX',
						'FX2' ,'FX3','FX4','HH',
						'HH2','FX5' ];
	
	var kongkeys = [ 'BD', 'SD', 'SD2', 'FX',
					'FX2' ,'FX3' ,'HH' ,'HH2',
					'FX4', 'FX5', 'FX6', 'FX7',
					'FX8', 'FX9', 'F10', 'F11' ];
	
	var drumkeys = redrumkeys; 
	
	var keyprefix = [ 'C-', 'C#', 'D-', 'D#' ,'E-' ,'F-' ,'F#', 'G-', 'G#', 'A-' ,'A#' ,'B-' ];
	
	return {
		
		activate: function(host) {
			_host = host;
			// _host.display.lcd = 'Note editor';
			_host.display.lcdPrintAt( 1, 1, 'PATTERN EDITOR' );
		},
		
		draw: function() {	
		},
		
		getNoteName: function(id,mode){
			if( mode == 'drum' ) {
				var k = id - 36;
				if( k >= 0 && k < drumkeys.length )
					return drumkeys[k];
				// return "#"+id;
			}
			var o = Math.floor(id / 12);
			var k = id % 12;
			return keyprefix[k]+''+o;
		},
		
		handleButton: function(id) {
			
			var trk = _host.song.getTrack( _host.state.currenttrack );
			var pat = trk.getPattern( _host.state.currentpattern );
				
			if( id == Keys.KNOB0_UP ) { _host.state.currentnote ++; if( _host.state.currentnote > 48 ) _host.state.currentnode = 36; }
			if( id == Keys.KNOB0_DN ) { _host.state.currentnote --; if( _host.state.currentnote < 36 ) _host.state.currentnode = 48; }

			if( id == Keys.KNOB1_UP ) { trk.gate ++; if( trk.gate > 127 ) trk.gate = 127; }
			if( id == Keys.KNOB1_DN ) { trk.gate --; if( trk.gate < 1 ) trk.gate = 1; }


			if( id == Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id == Keys.KNOB3_UP ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == Keys.KNOB3_DN ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }
			
			if( id >= Keys.PAD0 && id <= Keys.PAD15 ){
				var stpobj = pat.getStep( id - Keys.PAD0 );
				var oldnote = stpobj.getNote( _host.state.currentnote );
				if( oldnote != null )
					stpobj.clearNote( _host.state.currentnote );
				else
					stpobj.addNote( _host.state.currentnote, 100 );
			}
		}, 
		
		update: function() {
			var s = _host.sequencer.getPlayingGlobalStep();
			var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
		
			var trk = _host.song.getTrack( _host.state.currenttrack );
			var pat = trk.getPattern( _host.state.currentpattern );

			for( var j=0; j<16; j++ ){
				var stp = pat.getStep( j );
				var oldnote = stp.getNote( _host.state.currentnote );
				_host.display.leds[ Leds.PAD0 + j ] = (oldnote != null);
			}
		
			_host.display.lcdPrintAt( 1, 3, 'NOTE' );
			_host.display.lcdPrintAt( 6, 3, 'GATE' );
			_host.display.lcdPrintAt( 11, 3, 'TRAK' );
			_host.display.lcdPrintAt( 16, 3, 'PATT' );
			
			_host.display.lcdPrintAt( 1, 4, this.getNoteName( _host.state.currentnote, trk.type )  + '  ' );
			_host.display.lcdPrintAt( 6, 4, trk.gate + ' ' );
			_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack + '  ' );
			_host.display.lcdPrintAt( 16, 4, _host.state.currentpattern + '  ' );
		
				// console.log('devicecontroller step',s,b);
			if( pp == _host.state.currentpattern && trk.enabled && pat.enabled )
				_host.display.leds[Leds.PAD0+ps] = !_host.display.leds[Leds.PAD0+ps];
 
		}
		
	};
};

