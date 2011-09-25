//
// Device controller
//
 
exports.DeviceController = function( opts ){
	
	var _seq = opts.sequencer || null;
	var _song = _seq.getSong();
	
	var lastleds = [];
	var lastlcd = '';
	var currentleds = [];
	var currentlcd = '';

	var currentmode = 'step';
	var currenttrack = 0;
	var currentpattern = 0;
	var currentnote = 36;

	for( var i=0; i<100; i++ ) {
		currentleds.push(false);
		lastleds.push(false);
	}
	
	sendUpdates = function() {
		if( currentlcd != lastlcd ) {
			// console.log('lcd changed to:', currentlcd);
			fireUpdateDevice( { type: 'lcd', content: currentlcd } );
			lastlcd = currentlcd;
		}
		for( var i=0; i<100; i++ ) {
			if( currentleds[i] != lastleds[i] ) {
				// console.log('led '+i+' changed to '+currentleds[i]);
				fireUpdateDevice( { type: 'led', led: i, on: currentleds[i] } );
			}
			lastleds[i] = currentleds[i];
		}		
	}
	
	var _updateCallback = opts.updateCallback || null;
	
	fireUpdateDevice = function(data) {
		if( _updateCallback != null )
		 	_updateCallback(data);
	};
	
	fireUpdateDevice( { type: 'lcd-clear' } );
	fireUpdateDevice( { type: 'lcd', content: 'Boot' } );
	fireUpdateDevice( { type: 'lcd-xy', x:3, y:7, content: 'Boot' } );

	return {

		handleButtonClick: function(id) {

			console.log( 'DeviceController handleButtonClick', id ); 

			// currentleds[id] = !currentleds[id];
			
			if( id == 30 ) { currentnote ++; if( currentnote > 48 ) currentnode = 36; }
			if( id == 31 ) { currentnote --; if( currentnote < 36 ) currentnode = 48; }

			if( id == 34 ) { currenttrack ++; if( currenttrack > 15 ) currenttrack = 0; }
			if( id == 35 ) { currenttrack --; if( currenttrack < 0 ) currenttrack = 15; }

			if( id == 36 ) { currentpattern ++; if( currentpattern > 15 ) currentpattern = 0; }
			if( id == 37 ) { currentpattern --; if( currentpattern < 0 ) currentpattern = 15; }
			
			if( id >= 0 && id < 16 ){
				var trk = _song.getTrack(currenttrack);
				var pat = trk.getPattern(currentpattern);
				var stpobj = pat.getStep(id);
				var oldnote = stpobj.getNote(currentnote);
				if( oldnote != null )
					stpobj.clearNote(currentnote);
				else
					stpobj.addNote(currentnote, 100);
			}
			
			this.update();
		},

		handleButtonDown: function( id ) { },
		handleButtonUp: function( id ) { },
		handleDeviceEvent: function( eventtype, eventarg ) { },
		
		update: function() {
			
			var s = _seq.getPlayingGlobalStep();
			var pp = _seq.getPlayingPattern(currenttrack);
			var ps = _seq.getPlayingPatternStep(currenttrack);
			var b = Math.floor( s ) % 16;
			// console.log('s='+s);
			
			var trk = _song.getTrack(currenttrack);
			var pat = trk.getPattern(currentpattern);
			for( var j=0; j<16; j++ ){
				var stp = pat.getStep(j);
				var oldnote = stp.getNote(currentnote);
				currentleds[j] = oldnote != null;
			}
			
			currentlcd = 'trk:'+currenttrack+'\n'+
				'pat:'+currentpattern+'\n'+
				'not:'+currentnote+'\n';
			
			// console.log('devicecontroller step',s,b);
			if( pp == currentpattern )
				currentleds[ps] = !currentleds[ps];
			currentleds[24] = (b==0);
			currentleds[25] = (b==4);
			currentleds[26] = (b==8);
			currentleds[27] = (b==12);
			
			sendUpdates();
		
		}
	}
};




