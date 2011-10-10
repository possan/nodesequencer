
var ScreenRouter = require('../screenrouter').ScreenRouter;
var ScreenRepository = require('../screenrepo').ScreenRepository;

var DummyScreen = function(){
	return { 
		events: [],
		handleEvent: function( data ) { this.events.push( data.type ); },
		anyEvents: function() { return this.events.length > 0; },
		hasEvent: function( type ) { return this.countEvent( type ) > 0; },
		countEvent: function( type ) { 
			var ret = 0;
			for( var j=0; j<this.events.length; j++ )
				if( this.events[j] === type )
					ret ++;
			return ret;
		}
	};
}

exports["routes-events"] = function(test) {
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('b',new DummyScreen());
	sr.switchTo('x');
	test.ok(!d1.anyEvents());
	test.ok(!d2.anyEvents());
	test.ok(!d1.hasEvent('activate'));
	test.ok(!d1.hasEvent('x'));
	test.ok(!d2.hasEvent('activate'));
	test.ok(!d2.hasEvent('x'));
	test.done();
};

exports["routes-events-2"] = function(test) {
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('b',new DummyScreen());
	sr.switchTo('a');
	sr.handleEvent( { type:'x' } );
	test.ok(!d2.anyEvents());
	test.ok(d1.hasEvent('x'));
	test.done();
};

exports["sends-activation-events"] = function(test) {
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('b',new DummyScreen());
	sr.switchTo('a');
	test.ok(!d2.anyEvents());
	test.ok(d1.hasEvent('activate'));
	test.done();
};

exports["sends-activation-events-2"] = function(test) {
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('b',new DummyScreen());
	sr.switchTo('a');
	sr.switchTo('b');
	test.ok(d1.hasEvent('activate'));
	test.ok(d1.hasEvent('deactivate'));
	test.ok(d2.hasEvent('activate'));
	test.done();
};

exports["handles-multiscreens"] = function(test) {
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('a',new DummyScreen());
	sr.switchTo('a'); sr.handleEvent( { type:'x' } );
	sr.switchTo('a'); sr.handleEvent( { type:'y' } );
	sr.switchTo('a'); sr.handleEvent( { type:'z' } );
	test.ok(d1.hasEvent('x'));
	test.ok(d2.hasEvent('y'));
	test.ok(d1.hasEvent('z'));
	test.done();
};

exports["routes-subscreens"] = function(test) {	
	var sr = new ScreenRouter();
	var d1 = sr.register('a',new DummyScreen());
	var d2 = sr.register('a',new DummyScreen());
	var d3 = sr.register('b',new DummyScreen());
	var d4 = sr.register('c',new DummyScreen());
	sr.switchTo('a'); sr.handleEvent( { type:'x' } );
	sr.switchTo('c'); sr.handleEvent( { type:'y' } );
	sr.switchTo('a'); sr.handleEvent( { type:'z' } );
	sr.switchTo('a'); sr.handleEvent( { type:'w' } );
	sr.switchTo('b'); sr.handleEvent( { type:'u' } );
	sr.switchTo('b'); sr.handleEvent( { type:'v' } );
	test.ok(d1.hasEvent('x'));
	test.ok(d4.hasEvent('y'));
	test.ok(d1.hasEvent('z'));
	test.ok(d2.hasEvent('w'));
	test.ok(d3.hasEvent('u'));
	test.ok(d3.hasEvent('v'));
	test.done();
};

exports["activates-subscreens"] = function(test) {	
	var sr = new ScreenRouter();
	var a1 = sr.register('a',new DummyScreen());
	var a2 = sr.register('a',new DummyScreen());
	var b1 = sr.register('b',new DummyScreen());
	var c1 = sr.register('c',new DummyScreen());
	sr.switchTo('a');
	sr.switchTo('c');
	sr.switchTo('a');
	sr.switchTo('a'); 
	sr.switchTo('b'); 
	sr.switchTo('b'); 
	test.equal(a1.countEvent('activate'),2,"a1 should be activated twice");
	test.equal(a2.countEvent('activate'),1,"a2 should be activated once");
	test.equal(b1.countEvent('activate'),1,"b should be activated once");
	test.equal(c1.countEvent('activate'),1,"c should be activated once");
	test.done();
};

exports["deactivates-subscreens"] = function(test) {	
	var sr = new ScreenRouter();
	var a1 = sr.register('a',new DummyScreen());
	var a2 = sr.register('a',new DummyScreen());
	var b1 = sr.register('b',new DummyScreen());
	var c1 = sr.register('c',new DummyScreen());
	sr.switchTo('a');
	sr.switchTo('c');
	sr.switchTo('a');
	sr.switchTo('a');
	sr.switchTo('b');
	sr.switchTo('b');
	test.equal(a1.countEvent('deactivate'),2);
	test.equal(a2.countEvent('deactivate'),1);
	test.equal(b1.countEvent('deactivate'),0);
	test.equal(c1.countEvent('deactivate'),1);
	test.done();
};

exports["cant-switch-to-unknown-or-same-screen"] = function(test) {	
	var sr = new ScreenRouter();	
	sr.register('a',new DummyScreen());
	sr.register('b',new DummyScreen());
	test.equal( sr.switchTo('a'), true );
	test.equal( sr.switchTo('a'), false );
	test.equal( sr.switchTo('x'), false );
	test.equal( sr.switchTo('b'), true );
	test.equal( sr.switchTo('b'), false );
	test.equal( sr.switchTo('a'), true );
	test.done();
};

exports["auto-registers-repository-items"] = function(test) {	
	ScreenRepository.screens = [];
	ScreenRepository.screens.push( { name: 'a', factory: function(){ return new DummyScreen(); } });
	ScreenRepository.screens.push( { name: 'b', factory: function(){ return new DummyScreen(); } });
	ScreenRepository.screens.push( { name: 'c', factory: function(){ return new DummyScreen(); } });
	var sr = new ScreenRouter( ScreenRepository.screens );
	test.equal( sr.switchTo('a'), true );
	test.equal( sr.switchTo('a'), false );
	test.equal( sr.switchTo('x'), false );
	test.equal( sr.switchTo('b'), true );
	test.equal( sr.switchTo('b'), false );
	test.equal( sr.switchTo('a'), true );
	ScreenRepository.screens = [];
	test.done();
};

