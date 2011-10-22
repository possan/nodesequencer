//
// Device controller
//

var devicecontrollermodule = require('./devicecontroller.js');

var SingletonOutputProxy = function( real ) {
	return {
		registerScreen: function(x) {
			real.registerScreen(x);
		},
		addOutput: function(x) {
			real.addOutput(x);
		},
		handleEvent: function(evt) {
			real.handleEvent(evt);
		}
	};
};

exports.DeviceControllerFactory = {

	screenPlugins : [],
	singleton : false,
	_instance : null,

	_innerCreateDeviceController : function(opts) {
		var dc = new devicecontrollermodule.DeviceController(opts);
		dc = new SingletonOutputProxy( dc );
		for ( var j = 0; j < this.screenPlugins.length; j++)
			dc.registerScreen(this.screenPlugins[j]);
		return dc;
	},

	createDeviceController : function(opts) {
		var _seq = opts.sequencer;
		var _cb = opts.callback;
		if (this.singleton) {
			if (this._instance == null)
				this._instance = this._innerCreateDeviceController( { 
					sequencer: _seq 
				} );
			this._instance.addOutput( _cb );
			return this._instance;
		}
		return this._innerCreateDeviceController( { 
			sequencer: _seq, 
			callback: _cb 
		} );
	}

};
