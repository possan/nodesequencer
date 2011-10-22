//
//
//

microtime = require('microtime');

exports.Player = function( opts ){
	
	var _ppqn = opts.ppqn || 96;
	var _callback = opts.callback || null;
	
	var _bpm = 130.0; 
	var _spt = 0;
	var _step = -1;

	calcticks = function() {
	 	var bps = _bpm / 60.0;
		var spb = 1.0 / (4 * bps);
		_spt = spb / _ppqn;
		console.log('bpm:',_bpm,'bps:',bps,'spb:',spb,'spt:',_spt);
	};

	calcticks();
	
	var _vclock = 0;
	var _playclock = 0;
	var _lt = 0;

	var exported = {
	
		getBPM: function(){ 
			return _bpm; 
		},
	
		setBPM: function(bpm){ 
			if( bpm == _bpm )
				return;
			_bpm = bpm;
			calcticks(); 
		},
	
		reset: function () {
			_step = -1;
			_vclock = 0;
			_playclock = 0;
			_lt = 0;
		},
	
		step: function() {
			innerStep();
		},
	
		startTimer: function() {
			var self = this;
			setInterval( function() { 
				self.step();
			}, 1);
		}
	};
	
	innerStep = function() {
	
		var t = microtime.nowDouble();
		if( _lt == 0 )
			_lt = t;

		var dt = t - _lt;
		_vclock += dt;
		_lt = t;

		if( dt <= 0 )
			return;

		while( _playclock < _vclock ) {
		
			if( _callback != null )
				_callback( { 
					step : _step,
					ppqn : _ppqn,
					player: exported 
				} );
 
			_step ++;
			_playclock += _spt;
		}
	};

	return exported;
};


