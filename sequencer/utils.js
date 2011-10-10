
exports.Utils = {
	
	addmod: function(old,add,min,max) {
		old += add;
		if( old > max )
			old = min;
		if( old < min )
			old = max;
		return old;
	},
	
	addclamp: function(old,add,min,max) {
		old += add;
		if( old > max )
			old = max;
		if( old < min )
			old = min;
		return old;
	}
	
}

