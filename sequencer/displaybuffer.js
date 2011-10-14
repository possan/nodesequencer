//
// Device controller
//
 
C = require('./constants').C;
ScreenRouter = require('./screenrouter').ScreenRouter;
ScreenRepository = require('./screenrepo').ScreenRepository;

exports.DisplayBuffer = function( opts ) {
	
	var _width = opts.width || 20;
	var _height = opts.height || 4;
	var _updateCallback = opts.callback || function( dummy ) { };

	var	lastleds = [];
	var	lastlcd = '--';
	var _lcd = ['','','','','',''];
	
	_updateLcd = function(){
		
	}
	
	var ret = {
	
		leds: [],
		lcd: '',
		
		lcdClear: function() {
			_lcd  = [];
			for( var r=0; r<_height; r++ )
				_lcd.push( new Array(_width+1).join(' ' ) );
			this.lcd = _lcd.join('\n');
		},
		
		lcdPrintAt: function( column, row, str ) {
			//	_updateCallback( { type: 'lcd-xy', column:column, row:row, content: str } );
			if( row >= 1 && row <= _height ) {
				var line = _lcd[row-1].split('');
				// console.log(line);
				for( var j=0; j<str.length; j++ )
				{
					var x = column + j - 1;
					if( x >= 0 && x < _width )
						line[x] = str[j];
				}
				// console.log(line);
				_lcd[row-1] = line.join('');
				this.lcd = _lcd.join('\n');
			}
		},
			
		update: function() {
			
			// check lcd variable
			
			if( this.lcd != lastlcd ) {
				_updateCallback( { type: 'lcd', content: this.lcd } );
				// console.log('LCD:\n'+this.lcd);
				lastlcd = this.lcd;
			}

			// check leds
			
			for( var i=0; i<50; i++ ) {
				if( this.leds[i] != lastleds[i] )
					_updateCallback( { type: 'led', led: i, on: this.leds[i] } );
				lastleds[i] = this.leds[i];
			}
		}
		
	};
	
	for( var i=0; i<100; i++ ) {
		ret.leds.push(false);
		lastleds.push(false);
	}
	ret.lcdClear();
	lastlcd = ret.lcd;
	ret.update();

	return ret;
};
 


