var deviceControllerFactory = require('../devicecontrollerfactory.js').DeviceControllerFactory;

exports.create = function(test){
	var mockseq = { getSong: function () {return {} } };
	var cb = function( args ){ console.log(args); }
	var x = deviceControllerFactory.createDeviceController( { sequencer: mockseq, updateCallback: cb } );
	test.ok( x != null, "Should return a controller" );
	test.done();
};

exports.plugins1 = function(test){
	var mockseq = { getSong: function () {return {} } };
	var cb = function( args ){ console.log(args); }
	var mockdata1 = 0;
	var mockdata2 = 0;
	var mockplug1 = { register: function( dc ) { mockdata1++; } };
	var mockplug2 = { register: function( dc ) { mockdata2++; } };
	deviceControllerFactory.screenPlugins = [ mockplug1, mockplug2 ];
	var x = deviceControllerFactory.createDeviceController( { sequencer: mockseq, updateCallback: cb } );
	var y = deviceControllerFactory.createDeviceController( { sequencer: mockseq, updateCallback: cb } );
	test.ok( mockdata1 == 2, "mockplug1.register should be called" );
	test.ok( mockdata2 == 2, "mockplug2.register should be called" );
	test.done();
};

exports.plugins2 = function(test) {
	/*
	var mockplug1 = { register: function( dc ) { mockdata1++; } };
	deviceControllerFactory.screenPlugins = [ mockplug1 ];
	var x = deviceControllerFactory.createDeviceController( { sequencer: mockseq, updateCallback: cb } );
	*/
	test.done();
};


