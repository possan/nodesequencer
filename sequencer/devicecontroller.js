//
// Device controller
//
 
Keys = require('./keys.js').Keys;
Leds = require('./leds.js').Leds;

NotesScreen = require('./screen_notes.js').NotesScreen;
MixScreen = require('./screen_mix.js').MixScreen;
LoopScreen = require('./screen_loop.js').LoopScreen;
PatternsScreen = require('./screen_patterns.js').PatternsScreen;

var DisplayBuffer = function( callback ) {
	
	var _updateCallback = callback;

	var	lastleds = [];
	var	lastlcd = '--';
	
	var ret = {
	
		leds: [],
		lcd: '',
		
		lcdPrintAt: function( column, row, str ) {
			_updateCallback( { type: 'lcd-xy', column:column, row:row, content: str } );
		},
			
		sendUpdate: function() {
			/*
			if( this.lcd != lastlcd ) {
				// console.log('lcd changed to:', this.lcd);
				_updateCallback( { type: 'lcd-clear' } );
				_updateCallback( { type: 'lcd', content: this.lcd } );
				lastlcd = this.lcd;
			}
			*/
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
	host.nextscreen = 'mix';
	host.state.currenttrack = 0;
	host.state.currentpattern = 0;
	host.state.currentnote = 36;

	var screens = {};
	screens["note"] = new NotesScreen();
	screens["patterns"] = new PatternsScreen();
	screens["mix"] = new MixScreen();
	screens["loop"] = new LoopScreen();

    var lastscreen = '';
 
	var checkNextScreen = function() {
		if( host.nextscreen == '' )
			return;
		if( host.nextscreen != lastscreen ) {
			host.screen = host.nextscreen;
			console.log('changing screen to',host.screen);
			fireUpdateDevice( { type: 'lcd-clear' } );
			host.subscreen = 0;
			screens[ host.screen ].activate( host );
			screens[ host.screen ].update( host );
			lastscreen = host.screen;
		} else {
			host.subscreen ++;
			screens[ host.screen ].activate( host );
			screens[ host.screen ].update( host );
		}
		host.nextscreen = '';
	}	

	return {		

		handleButtonDown: function( id ) { },
		handleButtonUp: function( id ) { },
		handleDeviceEvent: function( eventtype, eventarg ) { },

		handleButtonClick: function( id ) {
			console.log( 'DeviceController handleButtonClick', id, host.screen ); 
			if( id == Keys.MODE0 ) { host.nextscreen = 'note'; }
			if( id == Keys.MODE1 ) { host.nextscreen = 'patterns'; }
			if( id == Keys.MODE2 ) { host.nextscreen = 'loop'; }
			if( id == Keys.MODE3 ) { host.nextscreen = 'mix'; }
			if( typeof( screens[ host.screen ] ) != 'undefined' )
 				screens[ host.screen ].handleButton( id );
			checkNextScreen();
			this.update();
		},
		
		update: function() {
			var s = host.sequencer.getPlayingGlobalStep();
			var b = Math.floor( s ) % 16;
			host.display.leds[ Leds.BEAT0 ] = (b==0);
			host.display.leds[ Leds.BEAT1 ] = (b==4);
			host.display.leds[ Leds.BEAT2 ] = (b==8);
			host.display.leds[ Leds.BEAT3 ] = (b==12);
			host.display.leds[ Leds.MODE0 ] = (host.screen == 'note');
			host.display.leds[ Leds.MODE1 ] = (host.screen == 'patterns');
			host.display.leds[ Leds.MODE2 ] = (host.screen == 'loop');
			host.display.leds[ Leds.MODE3 ] = (host.screen == 'mix');
			checkNextScreen();
			if( typeof( screens[ host.screen ] ) != 'undefined' ) 
				screens[ host.screen ].update();
			host.display.sendUpdate();
		}
	}
};




