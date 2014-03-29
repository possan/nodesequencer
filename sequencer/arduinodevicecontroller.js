var DeviceControllerFactory = require('./devicecontrollerfactory').DeviceControllerFactory;
C = require('./constants').C;

var ArduinoButtonRemapping = {};

ArduinoButtonRemapping[0] = C.Keys.PAD0+0;
ArduinoButtonRemapping[1] = C.Keys.PAD0+1;
ArduinoButtonRemapping[2] = C.Keys.PAD0+2;
ArduinoButtonRemapping[3] = C.Keys.PAD0+3;
ArduinoButtonRemapping[4] = C.Keys.PAD0+4;
ArduinoButtonRemapping[5] = C.Keys.PAD0+5;
ArduinoButtonRemapping[6] = C.Keys.PAD0+6;
ArduinoButtonRemapping[7] = C.Keys.PAD0+7;
ArduinoButtonRemapping[8] = C.Keys.PAD0+8;
ArduinoButtonRemapping[9] = C.Keys.PAD0+9;
ArduinoButtonRemapping[10] = C.Keys.PAD0+10;
ArduinoButtonRemapping[11] = C.Keys.PAD0+11;
ArduinoButtonRemapping[12] = C.Keys.PAD0+12;
ArduinoButtonRemapping[13] = C.Keys.PAD0+13;
ArduinoButtonRemapping[14] = C.Keys.PAD0+14;
ArduinoButtonRemapping[15] = C.Keys.PAD0+15;

ArduinoButtonRemapping[16] = C.Keys.MODE0;
ArduinoButtonRemapping[17] = C.Keys.MODE1;
ArduinoButtonRemapping[18] = C.Keys.MODE2;
ArduinoButtonRemapping[19] = C.Keys.MODE3;

var ArduinoLedMapping = {};

ArduinoLedMapping[C.Leds.PAD0+0] = 0;
ArduinoLedMapping[C.Leds.PAD0+1] = 1;
ArduinoLedMapping[C.Leds.PAD0+2] = 2;
ArduinoLedMapping[C.Leds.PAD0+3] = 3;
ArduinoLedMapping[C.Leds.PAD0+4] = 4;
ArduinoLedMapping[C.Leds.PAD0+5] = 5;
ArduinoLedMapping[C.Leds.PAD0+6] = 6;
ArduinoLedMapping[C.Leds.PAD0+7] = 7;
ArduinoLedMapping[C.Leds.PAD0+8] = 8;
ArduinoLedMapping[C.Leds.PAD0+9] = 9;
ArduinoLedMapping[C.Leds.PAD0+10] = 10;
ArduinoLedMapping[C.Leds.PAD0+11] = 11;
ArduinoLedMapping[C.Leds.PAD0+12] = 12;
ArduinoLedMapping[C.Leds.PAD0+13] = 13;
ArduinoLedMapping[C.Leds.PAD0+14] = 14;
ArduinoLedMapping[C.Leds.PAD0+15] = 15;

ArduinoLedMapping[C.Leds.BEAT0] = 16;
ArduinoLedMapping[C.Leds.BEAT1] = 17;
ArduinoLedMapping[C.Leds.BEAT2] = 18;
ArduinoLedMapping[C.Leds.BEAT3] = 19;

			// arduino hardware box input key remapper


exports.ArduinoDeviceController = function( opts ) {

	var _port = opts.port || null;
	var _seq = opts.sequencer || null;	

	_port.on('open', function() {
	
	var lastscreen = ['','','',''];
	
	var _controller = DeviceControllerFactory.createDeviceController( { 
		sequencer: _seq, 
		callback: function( arg ) {
			// console.log( 'updateDevice (arduino)', arg );
			if( arg.type == 'lcd-clear' ) {
				_port.write('C\n');
			}
			if( arg.type == 'led' ) {
				var realled = ArduinoLedMapping[arg.led];
				if( typeof( realled ) != 'undefined' ) {
					var n0 = ''+Math.floor(realled/10);
					var n1 = ''+realled%10;
					var n2 = arg.on?'1':'0';
					// console.log('L'+n0+n1+n2);
					_port.write('L'+n0+n1+n2+'\n');
				}
			}
			if( arg.type == 'lcd' ) {
				var l = arg.content.split('\n');
				for( var i=0; i<4; i++ ){
					if( l[i] != lastscreen[i] ){
						// console.log('R'+(i+1)+l[i]);
						_port.write('R'+(i+1)+l[i]+'\n');
						lastscreen[i] = l[i];
					}
				}
			}
		} 
	} );
	
	var handleCommand = function(cmd){
		console.log('handle arduinocommand: '+cmd);
	};
	
	var databuffer = '';
	
	_port.on("data", function (data) {
		console.log('got data',data);
		if(data[0]=='K') {
			var idx = data[1]-'1';
			var sub = data[2];
			// console.log('knob event', idx, sub);
			if(data=='K1+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB0_UP } );
			if(data=='K1-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB0_DN } );
			if(data=='K2+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB1_UP } );
			if(data=='K2-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB1_DN } );
			if(data=='K3+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB2_UP } );
			if(data=='K3-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB2_DN } );
			if(data=='K4+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB3_UP } );
			if(data=='K4-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB3_DN } );
			if(data=='K5+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB4_UP } );
			if(data=='K5-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB4_DN } );
		}
		if(data[0]=='B') {
			var idx = (data[1]-'0')*10+(data[2]-'0');
			var sub = data[3];
			var but = ArduinoButtonRemapping[ idx ];
			// console.log('button event', idx, sub);
			if( sub == 'D' )
				_controller.handleEvent( { type: C.Events.BUTTON_DOWN, button: but } );
			else if( sub == 'U' )
				_controller.handleEvent( { type: C.Events.BUTTON_UP, button: but } );
			else if( sub == 'C' )
 				_controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: but } );
		}
	} );

	_port.write('C\n');
	});
};


