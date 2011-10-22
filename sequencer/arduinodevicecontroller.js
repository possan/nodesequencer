var DeviceControllerFactory = require('./devicecontrollerfactory').DeviceControllerFactory;
C = require('./constants').C;

exports.ArduinoDeviceController = function( opts ) {

	var _port = opts.port || null;
	var _seq = opts.sequencer || null;	
	
	var lastscreen = ['','','',''];
	
	var _controller = DeviceControllerFactory.createDeviceController( { 
		sequencer: _seq, 
		callback: function( arg ) {
			// console.log( 'updateDevice (arduino)', arg );
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
		if(data=='K1+') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB0_UP } );
		if(data=='K1-') _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: C.Keys.KNOB0_DN } );
	} );
	
	// com.write("OMG IT WORKS\r");

	/*
	console.log('in SocketDeviceController constructor.');
	
	_sock.on('deviceButtonDown', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_DOWN, button: data.button } ); } );
	_sock.on('deviceButtonUp', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_UP, button: data.button } ); } );
	_sock.on('deviceButtonClick', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: data.button } ); } );

	var timer = setInterval( function() { _controller.handleEvent( { type: C.Events.UI_UPDATE } ); }, 40 );

	_sock.on('disconnect', function () {
		console.log('disconnect.');
		clearTimeout(timer);
	});
	*/
};


