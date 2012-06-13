var httpmodule = require('http');
var socketiomodule = require('socket.io');
var fs = require('fs');
var playermodule = require('./player');
var songmodule = require('./song');
var sequencermodule = require('./sequencer');
var devicecontrollermodule = require('./devicecontroller');
var devicecontrollerfactorymodule = require('./devicecontrollerfactory').DeviceControllerFactory;
var socketdevicecontrollermodule = require('./socketdevicecontroller');
var arduinodevicecontrollermodule = require('./arduinodevicecontroller');
var ScreenRepository = require('./screenrepo').ScreenRepository;
var serialportmodule = require("serialport");
C = require('./constants').C;

//
// Set up MIDI
//

console.log('Setting up MIDI...');

var midi = require('midi');
var midioutput = new midi.output();
console.log('port count:', midioutput.getPortCount());
console.log('port #0:', midioutput.getPortName(0)); 
midioutput.openPort(0);

//
// Set up song and sequencer
//

console.log('Setting up Song...');

var song = new songmodule.Song();

console.log('Setting up Sequencer...');

var seq = new sequencermodule.Sequencer( { 
	ppqn: 48,
	song: song,
	sendMidi: function(arg) { 
		midioutput.sendMessage(arg);
	}
} );

//
// Set up screens
//

console.log('Setting up Screens...');

ScreenRepository.screens = [];

require('./screen_notes').registerScreens( ScreenRepository.screens );
require('./screen_live').registerScreens( ScreenRepository.screens );
require('./screen_mix').registerScreens( ScreenRepository.screens );
require('./screen_loop').registerScreens( ScreenRepository.screens );
require('./screen_patterns').registerScreens( ScreenRepository.screens );
require('./screen_trackconfig').registerScreens( ScreenRepository.screens );

//
// Set up socket/http stuff
//

function handler (req, res) {
	var staticfiles = [
		{ url: '/jquery-1.6.4.min.js', filename: 'jquery-1.6.4.min.js', type: 'text/javascript' },
		{ url: '/index.css', filename: 'index.css', type: 'text/css' },
		{ url: '/index.html', filename: 'index.html', type: 'text/html' },
		{ url: '/index.js', filename: 'index.js', type: 'text/javascript' },
		{ url: '/', filename: 'index.html', type: 'text/html' }
	];
	var any = false;
	for( var k in staticfiles ) {	
		var file = staticfiles[k];	
		if( req.url != file.url )
			continue;
		any = true;
	  	fs.readFile( __dirname + '/' + file.filename, function (err, data) {
	    	if (err) {
	    		res.writeHead(500);
	     		return res.end('Error loading '+file.name);
	    	}
	    	res.writeHead(200);
	    	res.end(data);
	  	});
	}	
	if( !any ) {
		console.log(req.url,'not matching any file');
		res.writeHead(404);
    	res.end();
	}
}

console.log('set up webserver...');
var app = httpmodule.createServer(handler);
// app.listen(81);

console.log('set up ws-server...');
var io = socketiomodule.listen(app);
io.set('log level', 2);
io.sockets.on('connection', function (socket) {
	console.log('new connection',socket.id);
	new socketdevicecontrollermodule.SocketDeviceController( { sequencer: seq, socket: socket } );
});

//
// Set up serialport stuff
//

try {
	var com = new serialportmodule.SerialPort("/dev/tty.usbmodem411",{
		baudrate: 115200, // 9600+,
		parser: serialportmodule.parsers.readline("\n")
	} );
	console.log(com);
	// got connection, use singleton ui
	console.log('arduino connected, mirror displays - use singleton controller');
	devicecontrollerfactorymodule.singleton = true;
	new arduinodevicecontrollermodule.ArduinoDeviceController( { sequencer: seq, port: com } );
} catch(e) {
	console.log('no arduino connected.');
}

//
// Load song and set up autosave
//

console.log('loading last saved song.');

doSave = function() {
	// console.log('Auto-saving song...');
	var json = song.toJson();
	var str = JSON.stringify(json,null,'\t');
	fs.writeFile('lastsong.json', str, function (err) {
	  if (err) throw err;
	  console.log('Auto-saved song.');
	});
};

var loaded = false;
fs.readFile('lastsong.json', function (err,json) {
	loaded = true;
	if (typeof(json) != 'undefined'){
		try {
			var data = JSON.parse(json);
			if( data ){
				console.log('loaded song',data);
				song.parseJson(data);
			}
		} catch(e){
			
		}
		doSave();
	}
});

setInterval( function() { doSave(); }, 10000 );

//
// Set up sequence player
// 

seq.player = playermodule.Player( {
	ppqn: 48,
	callback: function( arg ) { 
		seq.step( arg );
	}
} );

console.log('starting playback.');
seq.player.startTimer();

console.log( 'App initialized, listening for connections ... ' ); 
app.listen(1200);
