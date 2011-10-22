//
// Multi-screen message routing
//

exports.ScreenRouter = function( repo ) {	
	
	var _all = {};
	var _name = '';
	var _sub = 0;
	
	var _innerRegisterFactory = function(name, factory) {
		if( typeof(_all[name]) == 'undefined' )
			_all[name] = [];
		_all[name].push( { instance: null, factory: factory } );
	};
	
	// register from repo automatically

	if( repo && typeof(repo) != 'undefined' )
		for( var k=0; k<repo.length; k++ )	
			_innerRegisterFactory( repo[k].name, repo[k].factory );
	
	return {
		
		register: function( name, handler ) {
			var _h = handler;
			_innerRegisterFactory( name, function() { return _h; } );
			return _h;
		},
		
		getScreen: function() {
			return _name;
		},
		
		switchTo: function( name, host ) {
			var ok = false;
			if( name === _name ) {
				
				// console.log('switch within subscreen:',name);
				
				if( typeof( _all[ _name ] ) != 'undefined' ) {
					var nsub = 	_all[ _name ].length;
					// har vi mer än en undersida, isf byt, annars inte
					
					// console.log(nsub,'subscreens');
					
					if( nsub > 1 ) {
						// deactivate current
						if( typeof( _all[ _name ][ _sub ] ) != 'undefined' )
						if( _all[ _name ][ _sub ].instance != null )
							_all[ _name ][ _sub ].instance.handleEvent( { type: 'deactivate', host : host } );
						// switch
						_sub ++;
						if( _sub >= nsub )
							_sub = 0;

						// console.log('next subscreen',_sub);

						// activate new
						if( typeof( _all[ _name ][ _sub ] ) != 'undefined' )
						{
							if( _all[ _name ][ _sub ].instance == null )
							{
							//	console.log('creating instance of', _name );
								_all[ _name ][ _sub ].instance = _all[ _name ][ _sub ].factory();
							//	console.log('created', _all[ _name ][ _sub ].instance);
							}
							// console.log('next subscreen', _all[ _name ][ _sub ].instance );
							if( _all[ _name ][ _sub ].instance != null )
								_all[ _name ][ _sub ].instance.handleEvent( { type: 'activate', host : host } );
						}
								
						ok = true;
					}
				}		
			} else {
				
				// console.log('switch to new screen:',name);
				
				// deactivate current
				if( typeof( _all[ _name ] ) != 'undefined' )
					if( typeof( _all[ _name ][ _sub ] ) != 'undefined' )
						if( _all[ _name ][ _sub ].instance != null )
							_all[ _name ][ _sub ].instance.handleEvent( { type: 'deactivate', host: host } );
					
				// switch
				_name = name;
				_sub = 0;
				
				// activate new
				if( typeof( _all[ _name ] ) != 'undefined' )
					if( typeof( _all[ _name ][ _sub ] ) != 'undefined' )
					{	
						if( _all[ _name ][ _sub ].instance == null ){
							// console.log('creating instance of', _name );
							_all[ _name ][ _sub ].instance = _all[ _name ][ _sub ].factory();
							// console.log('created', _all[ _name ][ _sub ].instance);
						}
						if( _all[ _name ][ _sub ].instance != null )
							_all[ _name ][ _sub ].instance.handleEvent( { type: 'activate', host : host } );
						ok = true;
					}
			}		
			return ok;
		},
		
		handleEvent: function(event, host) {
			if( typeof( _all[ _name ] ) == 'undefined' )
				return false;
		
			if( typeof( _all[ _name ][ _sub ] ) == 'undefined' )
				return false;
				
			if( _all[ _name ][ _sub ].instance == null )
				_all[ _name ][ _sub ].instance = _all[ _name ][ _sub ].factory();

			var newevent = event;
			newevent.host = host;
			if( _all[ _name ][ _sub ].instance != null )
				return _all[ _name ][ _sub ].instance.handleEvent( newevent );
			
			return false;
		}
		
	};
};

