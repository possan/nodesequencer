//
// Device controller
//

exports.DeviceController = function( opts ){
	
	var lastleds = [];
	var lastlcd = '';

	var currentleds = [];
	var currentlcd = '';

	for( var i=0; i<100; i++ ) {
		currentleds.push(false);
		lastleds.push(false);
	}
	
	sendUpdates = function() {
		
		if( currentlcd != lastlcd ) {
			console.log('lcd changed to:', currentlcd);
			fireUpdateDevice( { type: 'lcd', content: currentlcd } );
			lastlcd = currentlcd;
		}
		
		for( var i=0; i<100; i++ ) {
			if( currentleds[i] != lastleds[i] ) {
				console.log('led '+i+' changed to '+currentleds[i]);
				fireUpdateDevice( { type: 'led', led: i, on: currentleds[i] } );
			}
			lastleds[i] = currentleds[i];
		}		
	}
	
	var _seq = opts.sequencer || null;
	var _updateListeners = [];
	
	fireUpdateDevice = function(data){
		for(cb in _updateListeners)
			_updateListeners[cb](data);
	};
	
	fireUpdateDevice( { type: 'lcd', content: 'Boot' } );

	return {
		
		addUpdateDeviceHandler: function(cb){
			_updateListeners.push(cb);
		},

		handleButtonClick: function(id) {
			console.log( 'DeviceController handleButtonClick', id ); 
			currentleds[id] = !currentleds[id];
			sendUpdates();
		},

		handleButtonDown: function(id) {
			// console.log( 'DeviceController handleButtonDown', id );
		},

		handleButtonUp: function(id) {
			// console.log( 'DeviceController handleButtonUp', id );
		},

		handleDeviceEvent: function(eventtype, eventarg){
			console.log('DeviceController handleDeviceEvent',eventtype,eventarg);
			// fireUpdateDevice( { lcd: 'got event '+eventtype+', '+eventarg } );
		},
		
		step: function() {
			var s = _seq.getStep() / 4;
			var b = Math.floor( s ) % 4;
			// console.log('devicecontroller step',s,b);
			currentleds[24] = (b==0);
			currentleds[25] = (b==1);
			currentleds[26] = (b==2);
			currentleds[27] = (b==3);
			sendUpdates();
		}
	}
};




