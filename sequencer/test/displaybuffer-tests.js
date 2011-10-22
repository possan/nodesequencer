var DisplayBuffer = require('../displaybuffer.js').DisplayBuffer;

exports["is-empty-on-start"] = function(test){
	var disp = new DisplayBuffer( { width: 5, height: 3 } );
	disp.update();
	test.equals('     \n     \n     ', disp.lcd);
	test.done();
};

exports["can-print-inside-screen"] = function(test){
	var disp = new DisplayBuffer( { width: 5, height: 3 } );
	disp.update();
	disp.lcdPrintAt(1,1,'TEST');
	test.equals('TEST \n     \n     ', disp.lcd);
	disp.lcdPrintAt(2,2,'TEST');
	test.equals('TEST \n TEST\n     ', disp.lcd);
	test.done();
};

exports["can-clear-screen"] = function(test){
	var disp = new DisplayBuffer( { width: 5, height: 3 } );
	disp.update();
	disp.lcdPrintAt(1,1,'TEST');
	test.equals('TEST \n     \n     ', disp.lcd);
	disp.lcdClear();
	test.equals('     \n     \n     ', disp.lcd);
	test.done();
};

exports["clips-prints-to-screen"] = function(test){
	var disp = new DisplayBuffer( { width: 5, height: 3 } );
	disp.update();
	disp.lcdPrintAt(-1,1,'TEST');
	disp.lcdPrintAt(4,2,'TEST');
	test.equals('ST   \n   TE\n     ', disp.lcd);
	test.done();
};

exports["sends-events-on-lcd-changing"] = function(test){
	var events = [];
	var callback = function( evt ) { events.push( evt ); }
	var disp = new DisplayBuffer( { callback: callback, width: 5, height: 3 } );
	disp.lcdClear();
	disp.lcdPrintAt(1,1,'TEST');
	disp.update();
	// console.log(events);
	test.equals(1,events.length);
	test.equals('TEST \n     \n     ', events[0].content);
	test.equals('lcd',events[0].type);
	test.done();
};

exports["sends-events-on-leds-changing"] = function(test){
	var events = [];
	var callback = function( evt ) { events.push( evt ); }
	var disp = new DisplayBuffer( { callback: callback } );
	disp.leds[3] = false;
	disp.update();
	disp.leds[3] = true;
	disp.update();
	// console.log(events);
	test.equals(1,events.length);
	test.equals('led',events[0].type);
	test.equals(3,events[0].led);
	test.done();
};

