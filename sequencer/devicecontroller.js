//
// Device controller
//
 
C = require('./constants').C;
ScreenRouter = require('./screenrouter').ScreenRouter;
ScreenRepository = require('./screenrepo').ScreenRepository;

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
	
	var router = new ScreenRouter( ScreenRepository.screens );

	var host = new HostInfo(); 	
	host.sequencer = opts.sequencer || null;
	host.song = host.sequencer.getSong();
	host.display = new DisplayBuffer( fireUpdateDevice );
	host.nextscreen = 'mix';
	host.state.currenttrack = 0;
	host.state.currentpattern = 0;
	host.state.currentnote = 36;
	
	router.switchTo( 'mode0', host );

	var innerUpdate = function() {
		var s = host.sequencer.getPlayingGlobalStep();
		var b = Math.floor( s ) % 16;
		var sn = router.getScreen();
		host.display.leds[ C.Leds.BEAT0 ] = (b==0);
		host.display.leds[ C.Leds.BEAT1 ] = (b==4);
		host.display.leds[ C.Leds.BEAT2 ] = (b==8);
		host.display.leds[ C.Leds.BEAT3 ] = (b==12);
		host.display.leds[ C.Leds.MODE0 ] = (sn == 'mode0');
		host.display.leds[ C.Leds.MODE1 ] = (sn == 'mode1');
		host.display.leds[ C.Leds.MODE2 ] = (sn == 'mode2');
		host.display.leds[ C.Leds.MODE3 ] = (sn == 'mode3');
		// router.handleEvent( { type:Events.UI_UPDATE, host:host } );
		host.display.sendUpdate();
	};
	
	return {		
		
		registerScreen: function(obj){
			obj.register(host);
		},
		
		handleEvent: function( event ) {
			// console.log('handleEvent',event);
			var newevent = event;
			newevent.host = host;
			if( newevent.type == C.Events.BUTTON_CLICK ){
				if( newevent.button == C.Keys.MODE0 ) router.switchTo( 'mode0', host );
				if( newevent.button == C.Keys.MODE1 ) router.switchTo( 'mode1', host );
				if( newevent.button == C.Keys.MODE2 ) router.switchTo( 'mode2', host );
				if( newevent.button == C.Keys.MODE3 ) router.switchTo( 'mode3', host );
			}
			router.handleEvent( newevent );
			if( newevent.type == C.Events.BUTTON_CLICK || 
				newevent.type == C.Events.BUTTON_DOWN || 
				newevent.type == C.Events.BUTTON_UP || 
				newevent.type == C.Events.UI_UPDATE )
				innerUpdate();
		}
	}
};




