//
// Device controller
//
 
C = require('./constants').C;
ScreenRouter = require('./screenrouter').ScreenRouter;
ScreenRepository = require('./screenrepo').ScreenRepository;
DisplayBuffer = require('./displaybuffer').DisplayBuffer;
DisplayBumper = require('./displaybumper').DisplayBumper;

var HostInfo = function(){
	return {
		sequencer: null,
		song: null,
		display: null,
		displaybumper: null,
		screen: '',
		nextscreen: '',
		subscreen: 0,
		state: {
		}
	};
};
	
exports.DeviceController = function( opts ) {

	var _updateCallbacks = [];
	if( opts.callback )
		_updateCallbacks.push( opts.callback );
		
	var fireUpdateDevice = function(data) {
		// console.log(data, _updateCallbacks);
		for( var j=0; j<_updateCallbacks.length; j++ )
			_updateCallbacks[j]( data );
	};
	
	var router = new ScreenRouter( ScreenRepository.screens );

	var host = new HostInfo();
	host.sequencer = opts.sequencer || null;
	host.song = host.sequencer.getSong();
	host.display = new DisplayBuffer( { width: 20, height: 4, callback: fireUpdateDevice } );
	host.displaybumper = new DisplayBumper();
	host.state.currenttrack = 0;
	host.state.currentpattern = 0;
	host.state.currentnote = 36;
	
	router.switchTo( 'mode0', host );

	var innerUpdate = function() {
		var s = host.sequencer.getPlayingGlobalStep();
		var b = Math.floor( s ) % 16;
		var sn = router.getScreen();
		host.display.leds[ C.Leds.BEAT0 ] = (b==0 || b == 1);
		host.display.leds[ C.Leds.BEAT1 ] = (b==4 || b == 5);
		host.display.leds[ C.Leds.BEAT2 ] = (b==8 || b == 9);
		host.display.leds[ C.Leds.BEAT3 ] = (b==12 || b == 13);
		host.display.leds[ C.Leds.MODE0 ] = (sn == 'mode0');
		host.display.leds[ C.Leds.MODE1 ] = (sn == 'mode1');
		host.display.leds[ C.Leds.MODE2 ] = (sn == 'mode2');
		host.display.leds[ C.Leds.MODE3 ] = (sn == 'mode3');
		host.displaybumper.update( host );
		host.display.update();
	};
	
	var _innerHandleEvent = function( event ) {
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
	};
	
	var timer = setInterval( function() { _innerHandleEvent( { type: C.Events.UI_UPDATE } ); }, 40 );
	
//	_sock.on('disconnect', function () {
//		console.log('disconnect.');
//		clearTimeout(timer);
//	});

	return {		
		
		addOutput: function( o ) {
			_updateCallbacks.push( o );
		},
		
		registerScreen: function(obj){
			obj.register(host);
		},
		
		handleEvent: function(ev) {
			_innerHandleEvent(ev);
		}
	};
};




