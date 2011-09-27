var devicecontrollermodule = require('./devicecontroller.js');

exports.SocketDeviceController = function( opts ) {
	
	var _sock = opts.socket || null;
	var _seq = opts.sequencer || null;
	
	var _controller = new devicecontrollermodule.DeviceController( { 
		sequencer: _seq, 
		updateCallback: function( arg ) {
			_sock.emit( 'updateDevice', arg );
		} 
	} );
	
	console.log('in SocketDeviceController constructor.');
	
	_sock.on('deviceButtonDown', function(data) {
		_controller.handleButtonDown( data.button );
	} );
	
	_sock.on('deviceButtonUp', function(data) {
		_controller.handleButtonUp( data.button );
	} );
	
	_sock.on('deviceButtonClick', function(data) {
		_controller.handleButtonClick( data.button );
	} );
	
	return {
		update: function() {
			// console.log('socket update',_sock.id)
			_controller.update();
		}
	};
	
};


