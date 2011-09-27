//
// Device controller
//
 
var DisplayBuffer = function( callback ) {
	
	var _updateCallback = callback;

	var	lastleds = [];
	var	lastlcd = '--';
	
	var ret = {
	
		leds: [],
		lcd: '',
			
		sendUpdate: function() {
			
			if( this.lcd != lastlcd ) {
				// console.log('lcd changed to:', this.lcd);
				_updateCallback( { type: 'lcd-clear' } );
				_updateCallback( { type: 'lcd', content: this.lcd } );
				lastlcd = this.lcd;
			}
			
			for( var i=0; i<50; i++ ) {
				if( this.leds[i] != lastleds[i] ) {
					// 	console.log('led '+i+' changed to '+this.leds[i]);
					_updateCallback( { type: 'led', led: i, on: this.leds[i] } );
				}
				lastleds[i] = this.leds[i];
			}
		}
		
	};
	
	for( var i=0; i<100; i++ ) {
		ret.leds.push(false);
		lastleds.push(false);
	}

	return ret;
};

var HostInfo = function(){
	return {
		sequencer: null,
		song: null,
		display: null,
		screen: '',
		nextscreen: '',
		subscreen: 0,
		state: {
		}
	};
}


TrackScreen = function() {
	
	var _host = null;

	return {
		
		activate: function(host) {
			_host = host;
			_host.display.lcd = 'Note editor';
		},
		
		draw: function() {	
		},
		
		handleButton: function(id) {			
			if( id == 30 ) { _host.state.currentnote ++; if( _host.state.currentnote > 48 ) _host.state.currentnode = 36; }
			if( id == 31 ) { _host.state.currentnote --; if( _host.state.currentnote < 36 ) _host.state.currentnode = 48; }

			if( id == 34 ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == 35 ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }

			if( id == 36 ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == 37 ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }
			
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
				_host.display.leds[ j ] = oldnote != null;
			}
		
			_host.display.lcd = 'track/note\ntrk:' + _host.state.currenttrack + '\n'+
				'pat:'+_host.state.currentpattern + '\n'+
				'not:'+_host.state.currentnote + '\n';
		
				// console.log('devicecontroller step',s,b);
			if( pp == _host.state.currentpattern )
				_host.display.leds[ps] = !_host.display.leds[ps];
 
		}
		
	};
};

MixScreen = function() {
	var _host = null;
	return {
		activate: function(host) {
			_host = host;
			_host.display.lcd = '';
		},
		
		handleButton: function( id ) {
			if( id >= 0 && id < 16 ) {
				var strk = _host.song.getTrack( id );
				strk.enabled = !strk.enabled;
				_host.state.currenttrack = id; // byt current track
			}
			if( id == 34 ) { 
				var bpm = _host.sequencer.player.getBPM();
				bpm += 0.1;
				_host.sequencer.player.setBPM( bpm );
			}
			if( id == 36 ) { 
				var bpm = _host.sequencer.player.getBPM();
				bpm += 1.0;
				_host.sequencer.player.setBPM( bpm );
			}
			if( id == 35 ) { 
				var bpm = _host.sequencer.player.getBPM();
				bpm -= 0.1;
				_host.sequencer.player.setBPM( bpm );
			}
			if( id == 37 ) { 
				var bpm = _host.sequencer.player.getBPM();
				bpm -= 1.0;
				_host.sequencer.player.setBPM( bpm );
			}
		},
		 
		update: function() {
			var bpm = _host.sequencer.player.getBPM();
			_host.display.lcd = 'Mixer\nClick to mute\nBPM: '+Math.round(bpm,2);
			var s = _host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 4;
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
			for( var j=0; j<16; j++ ) {
				var pp = _host.sequencer.getPlayingPattern( j );
				var strk = _host.song.getTrack( j );
				_host.display.leds[j] = strk.enabled;
				if( pp != -1 && b == 0 )
					_host.display.leds[j] = false;
			}
		}
	};
};

PatternsScreen = function(opts) {
	var _host = null;
	return {
		activate: function(host) {
			_host = host;
			_host.display.lcd = 'Patterns enable';
		},
		handleButton: function(id) {
			if( id == 34 ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == 35 ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }
			if( id >= 0 && id < 16 ) {
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( id );
				sstp.enabled = !sstp.enabled;
				_host.state.currentpattern = id;
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
				_host.display.leds[i] = sstp.enabled;
			}
			var ps = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			_host.display.lcd = 'Enabled pattern\nClick to toggle\nTrack #'+_host.state.currenttrack+' '+ps;
			if( ps != -1 && b == 0 )
				_host.display.leds[ps] = !_host.display.leds[ps];
		}
	};
};
	
LoopScreen = function(opts) {	
	var _host = null;
	return {
		activate: function(host) {
			_host = host;
			_host.display.lcd = 'Tempo';
		},
		handleButton: function(id) {

			if( id == 34 ) { _host.state.currenttrack ++; if( _host.state.currenttrack > 15 ) _host.state.currenttrack = 0; }
			if( id == 35 ) { _host.state.currenttrack --; if( _host.state.currenttrack < 0 ) _host.state.currenttrack = 15; }

			if( id == 36 ) { _host.state.currentpattern ++; if( _host.state.currentpattern > 15 ) _host.state.currentpattern = 0; }
			if( id == 37 ) { _host.state.currentpattern --; if( _host.state.currentpattern < 0 ) _host.state.currentpattern = 15; }

			if( id >= 0 && id <= 15 ){
				
				var strk = _host.song.getTrack( _host.state.currenttrack );
				var sstp = strk.getPattern( _host.state.currentpattern );

				// set start or end
				if( _host.subscreen % 2 == 0 ) { // start
					sstp.start = id;
				} else {
					sstp.end = id;
				}	
				if( sstp.start >= sstp.end )
					sstp.end = sstp.start;
				else if( sstp.end <= sstp.start )
					sstp.start = sstp.end;
			}


		}, 
		update: function() {

			var s = _host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 4;

			var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
			var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );

			var strk = _host.song.getTrack( _host.state.currenttrack );
			var sstp = strk.getPattern( _host.state.currentpattern );

			for(var i=0; i<16; i++ ) {
				_host.display.leds[i] = ( i >= sstp.start && i <= sstp.end );
			}
				
			if( b == 0 ) {
				if( _host.subscreen % 2 == 0 ) { // start
					_host.display.leds[ sstp.start ] = !_host.display.leds[ sstp.start ];
				} else { // end
					_host.display.leds[ sstp.end ] = !_host.display.leds[ sstp.end ];
				}		
			}
			
			if( pp == _host.state.currentpattern )
				_host.display.leds[ ps ] = !_host.display.leds[ ps ];
			
			if( _host.subscreen % 2 == 0 ) {
				_host.display.lcd = 'Patternloop start\nClick to set\nTrack #'+_host.state.currenttrack+' Pat #'+_host.state.currentpattern;
			} else {
				_host.display.lcd = 'Patternloop end\nClick to set\nTrack #'+_host.state.currenttrack+' Pat #'+_host.state.currentpattern;
			}
		}
	};
}; 



exports.DeviceController = function( opts ) {

	var _updateCallback = opts.updateCallback || null;	
	var fireUpdateDevice = function(data) {
		if( _updateCallback == null )
			return;
		// console.log('fire update',data); 
		_updateCallback( data );
	};
	
	var host = new HostInfo(); 	
	host.sequencer = opts.sequencer || null;
	host.song = host.sequencer.getSong();
	host.display = new DisplayBuffer( fireUpdateDevice );
	host.state.nextscreen = 'note';
	host.state.currenttrack = 0;
	host.state.currentpattern = 0;
	host.state.currentnote = 36;

	var screens = {};
	screens["note"] = new TrackScreen();
	screens["patterns"] = new PatternsScreen();
	screens["mix"] = new MixScreen();
	screens["loop"] = new LoopScreen();

    var lastscreen = '';

	fireUpdateDevice( { type: 'lcd-clear' } );
	fireUpdateDevice( { type: 'lcd', content: 'Boot' } );
	fireUpdateDevice( { type: 'lcd-xy', x:3, y:7, content: 'Boot' } );
 
	var checkNextScreen = function() {
		if( host.nextscreen != '' ){
			if( host.nextscreen != lastscreen ) {
				host.screen = host.nextscreen;
				console.log('changing screen to',host.screen);
				screens[ host.screen ].activate( host );
				host.subscreen = 0;
				lastscreen = host.screen;
			} else {
				host.subscreen ++;
			}
			host.nextscreen = '';
		}
	}	

	return {		

		handleButtonDown: function( id ) { },
		handleButtonUp: function( id ) { },
		handleDeviceEvent: function( eventtype, eventarg ) { },

		handleButtonClick: function( id ) {

			console.log( 'DeviceController handleButtonClick', id ); 

			if( id == 20 ) { host.nextscreen = 'note'; }
			if( id == 21 ) { host.nextscreen = 'patterns'; }
			if( id == 22 ) { host.nextscreen = 'loop'; }
			if( id == 23 ) { host.nextscreen = 'mix'; }

			if( typeof( screens[ host.screen ] ) != 'undefined' )
 				screens[ host.screen ].handleButton( id );
			
			checkNextScreen();
			this.update();
		},
		
		update: function() {
			
			var s = host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 16;
			
			host.display.leds[24] = (b==0);
			host.display.leds[25] = (b==4);
			host.display.leds[26] = (b==8);
			host.display.leds[27] = (b==12);
			
			host.display.leds[20] = (host.screen == 'note');
			host.display.leds[21] = (host.screen == 'patterns');
			host.display.leds[22] = (host.screen == 'loop');
			host.display.leds[23] = (host.screen == 'mix');
			
			checkNextScreen();
			
			if( typeof( screens[ host.screen ] ) != 'undefined' )
				screens[ host.screen ].update();
			
			host.display.sendUpdate();
		}
	}
};




