//
//
//

Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;
 

exports.NotesScreen = function() {
	
	var _host = null;

	return {
		
		activate: function(host) {
			_host = host;
			_host.display.lcd = 'Note editor';
		},
		
		draw: function() {	
		},
		
		handleButton: function(id) {
			
			if( id == Keys.KNOB0_UP ) { _host.state.currentnote ++; if( _host.state.currentnote > 48 ) _host.state.currentnode = 36; }
			if( id == Keys.KNOB0_DN ) { _host.state.currentnote --; if( _host.state.currentnote < 36 ) _host.state.currentnode = 48; }
			if( id == Keys.KNOB2_UP ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == Keys.KNOB2_DN ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id == Keys.KNOB3_UP ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == Keys.KNOB3_DN ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }
			
			if( id >= 0 && id < 16 ){
				var trk = _host.song.getTrack(_host.state.currenttrack);
				var pat = trk.getPattern(_host.state.currentpattern);
				var stpobj = pat.getStep(id);
				var oldnote = stpobj.getNote(_host.state.currentnote);
				if( oldnote != null )
					stpobj.clearNote(_host.state.currentnote);
				else
					stpobj.addNote(_host.state.currentnote, 100);
			}
		}, 
		
		update: function() {
			var s = _host.sequencer.getPlayingGlobalStep();
			var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
			// console.log('s='+s);
		
			var trk = _host.song.getTrack( _host.state.currenttrack );
			var pat = trk.getPattern( _host.state.currentpattern );
			for( var j=0; j<16; j++ ){
				var stp = pat.getStep( j );
				var oldnote = stp.getNote( _host.state.currentnote );
				_host.display.leds[ Leds.PAD0+j ] = oldnote != null;
			}
		
			_host.display.lcd = 'track/note\ntrk:' + _host.state.currenttrack + '\n'+
				'pat:'+_host.state.currentpattern + '\n'+
				'not:'+_host.state.currentnote + '\n';
		
				// console.log('devicecontroller step',s,b);
			if( pp == _host.state.currentpattern )
				_host.display.leds[Leds.PAD0+ps] = !_host.display.leds[Leds.PAD0+ps];
 
		}
		
	};
};

