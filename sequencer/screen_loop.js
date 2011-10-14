
//
//
//

C = require('./constants').C;
Utils = require('./utils').Utils;
 
LoopStartScreen = function(opts) {	
	var _host = null;
	
	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('PATTERN LOOP','START POINT');
	};

	var _handleButton = function(id) {
		var strk = _host.song.getTrack( _host.state.currenttrack );
		var sstp = strk.getPattern( _host.state.currentpattern );
		
		if( id == C.Keys.KNOB2_UP ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, 1, 0, 15 );
		if( id == C.Keys.KNOB2_DN ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, -1, 0, 15 );
		if( id == C.Keys.KNOB3_UP ) _host.state.currentpattern = Utils.addmod( _host.state.currentpattern, 1, 0, 15 );
		if( id == C.Keys.KNOB3_DN ) _host.state.currentpattern = Utils.addmod( _host.state.currentpattern, -1, 0, 15 );	
		if( id == C.Keys.KNOB0_UP ) sstp.start = Utils.addclamp( sstp.start, 1, 0, 15 );
		if( id == C.Keys.KNOB0_DN ) sstp.start = Utils.addclamp( sstp.start, -1, 0, 15 );
		if( id == C.Keys.KNOB1_UP ) sstp.end = Utils.addclamp( sstp.end, 1, 0, 15 );
		if( id == C.Keys.KNOB1_DN ) sstp.end = Utils.addclamp( sstp.end, -1, 0, 15 );
			
		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ){
			sstp.start = id - C.Keys.PAD0;
		}
			
		if( sstp.start >= sstp.end ) sstp.end = sstp.start;
		else if( sstp.end <= sstp.start ) sstp.start = sstp.end;
	};
		
	var _update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor( s ) % 4;
		var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
		var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );
		var strk = _host.song.getTrack( _host.state.currenttrack );
		var sstp = strk.getPattern( _host.state.currentpattern );
			
		for(var i=0; i<16; i++ ) {
			_host.display.leds[ C.Leds.PAD0+i] = ( i >= sstp.start && i <= sstp.end );
		}
		if( pp == _host.state.currentpattern && sstp.enabled && strk.enabled )
			_host.display.leds[ C.Leds.PAD0+ps ] = !_host.display.leds[ C.Leds.PAD0+ps ];
				
		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1,1, 'PATTERNLOOP STRT' );
		_host.display.lcdPrintAt( 1, 3, 'STA*' );
		_host.display.lcdPrintAt( 6, 3, 'END' );
		_host.display.lcdPrintAt( 11, 3, 'TRAK' );
		_host.display.lcdPrintAt( 16, 3, 'PATT' );
		_host.display.lcdPrintAt( 1, 4, sstp.start + ' ' );
		_host.display.lcdPrintAt( 6, 4, sstp.end + ' ' );
		_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack+' ' );
		_host.display.lcdPrintAt( 16, 4, _host.state.currentpattern+' ' );
	};
		
	return {	
		handleEvent: function(event) {
			switch(event.type){
				case C.Events.BUTTON_CLICK: _handleButton(event.button); break;
				case C.Events.UI_ACTIVATE: _activate(event.host); break;
				case C.Events.UI_UPDATE: _update(); break;
			}
		}	
	};
}; 

LoopEndScreen = function( opts ) {	
	var _host = null;

	var _activate = function( host ) {
		_host = host;
		_host.displaybumper.setMessage('PATTERN LOOP','END POINT');
	};
	
	var _handleButton = function(id) {
		var strk = _host.song.getTrack( _host.state.currenttrack );
		var sstp = strk.getPattern( _host.state.currentpattern );
		
		if( id == C.Keys.KNOB2_UP ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, 1, 0, 15 );
		if( id == C.Keys.KNOB2_DN ) _host.state.currenttrack = Utils.addmod( _host.state.currenttrack, -1, 0, 15 );
		if( id == C.Keys.KNOB3_UP ) _host.state.currentpattern = Utils.addmod( _host.state.currentpattern, 1, 0, 15 );
		if( id == C.Keys.KNOB3_DN ) _host.state.currentpattern = Utils.addmod( _host.state.currentpattern, -1, 0, 15 );	
		if( id == C.Keys.KNOB0_UP ) sstp.start = Utils.addclamp( sstp.start, 1, 0, 15 );
		if( id == C.Keys.KNOB0_DN ) sstp.start = Utils.addclamp( sstp.start, -1, 0, 15 );
		if( id == C.Keys.KNOB1_UP ) sstp.end = Utils.addclamp( sstp.end, 1, 0, 15 );
		if( id == C.Keys.KNOB1_DN ) sstp.end = Utils.addclamp( sstp.end, -1, 0, 15 );
			
		if( id >= C.Keys.PAD0 && id <= C.Keys.PAD15 ){
			sstp.end = id - C.Keys.PAD0;
		}
			
		if( sstp.start >= sstp.end ) sstp.end = sstp.start;
		else if( sstp.end <= sstp.start ) sstp.start = sstp.end;
	};
		
	var _update = function() {

		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor( s ) % 4;

		var pp = _host.sequencer.getPlayingPattern( _host.state.currenttrack );
		var ps = _host.sequencer.getPlayingPatternStep( _host.state.currenttrack );

		var strk = _host.song.getTrack( _host.state.currenttrack );
		var sstp = strk.getPattern( _host.state.currentpattern );
			
		for(var i=0; i<16; i++ ) {
			_host.display.leds[ C.Leds.PAD0+i] = ( i >= sstp.start && i <= sstp.end );
		}

		if( pp == _host.state.currentpattern && sstp.enabled && strk.enabled )
			_host.display.leds[ C.Leds.PAD0+ps ] = !_host.display.leds[ C.Leds.PAD0+ps ];

		_host.display.lcdClear();
		_host.display.lcdPrintAt( 1,1, 'PATTERNLOOP END' );

		_host.display.lcdPrintAt( 1, 3, 'STRT' )
		_host.display.lcdPrintAt( 6, 3, 'END*' );
		_host.display.lcdPrintAt( 11, 3, 'TRAK' );
		_host.display.lcdPrintAt( 16, 3, 'PATT' );

		_host.display.lcdPrintAt( 1, 4, sstp.start + ' ' );
		_host.display.lcdPrintAt( 6, 4, sstp.end + ' ' );
		_host.display.lcdPrintAt( 11, 4, _host.state.currenttrack+' ' );
		_host.display.lcdPrintAt( 16, 4, _host.state.currentpattern+' ' );
	};
			
	return {
		handleEvent: function(event) {
			switch(event.type) {
				case C.Events.BUTTON_CLICK: _handleButton(event.button); break;
				case C.Events.UI_ACTIVATE: _activate(event.host); break; 
				case C.Events.UI_UPDATE: _update(); break;
			}
		}
	};
}; 

exports.registerScreens = function( repo ) {
	repo.push( { name: 'mode1', factory: function(){ return new LoopEndScreen(); } } );
	repo.push( { name: 'mode1', factory: function(){ return new LoopStartScreen(); } } );
};



