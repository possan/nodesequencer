var DeviceControllerFactory = require('./devicecontrollerfactory').DeviceControllerFactory;
C = require('./constants').C;

exports.SocketDeviceController = function( opts ) {
	
	var _sock = opts.socket || null;
	var _seq = opts.sequencer || null;	
	
	var _controller = DeviceControllerFactory.createDeviceController( { 
		sequencer: _seq, 
		updateCallback: function( arg ) {
			_sock.emit( 'updateDevice', arg );
		} 
	} );
	
	console.log('in SocketDeviceController constructor.');
	
	_sock.on('deviceButtonDown', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_DOWN, button: data.button } ); } );
	_sock.on('deviceButtonUp', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_UP, button: data.button } ); } );
	_sock.on('deviceButtonClick', function(data) { _controller.handleEvent( { type: C.Events.BUTTON_CLICK, button: data.button } ); } );

	var timer = setInterval( function() { _controller.handleEvent( { type: C.Events.UI_UPDATE } ); }, 40 );
	
	_sock.on('disconnect', function () {
		console.log('disconnect.');
		clearTimeout(timer);
	});
	
};


