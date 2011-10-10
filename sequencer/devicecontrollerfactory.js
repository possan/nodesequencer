//
// Device controller
//
 
var devicecontrollermodule = require('./devicecontroller.js');

exports.DeviceControllerFactory = {

	screenPlugins: [],
	
	createDeviceController: function( opts ) {
		var dc = new devicecontrollermodule.DeviceController( opts );
		for( var j=0; j<this.screenPlugins.length; j++ )
			dc.registerScreen(this.screenPlugins[j]);
		return dc;
	}
	
};




