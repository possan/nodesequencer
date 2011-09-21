//
//
//

exports.Track = function(){
	
	return {
		parseJson: function(obj){
		},
	
		toJson: function() {
		}
	};
};

exports.Song = function() {
	
	return {
		parseJson: function(obj){
		},
	
		toJson: function() {
		}
	}; 
	
};

exports.Sequencer = function( opts ){
	
	var _ppqn = opts.ppqn || 96;
	var _song = opts.song || null;
	var _step = 0;
	
	return {
		
		getStep: function() {
			return _step / _ppqn;
		},
		
		step: function(arg) {
			// if( arg.ppqn )
			// 	_ppqn = arg.ppqn;
			// if( arg.ppqn )
			//	 _ppqn = arg.ppqn;
			_step ++;
		}
	}
	
};




