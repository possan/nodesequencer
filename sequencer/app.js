var httpmodule = require('http');
var socketiomodule = require('socket.io');
var fs = require('fs');
var playermodule = require('./player.js');
var songmodule = require('./song.js');
var sequencermodule = require('./sequencer.js');
var devicecontrollermodule = require('./devicecontroller.js');
var socketdevicecontrollermodule = require('./socketdevicecontroller.js');


//
// Set up MIDI
//

var midi = require('midi');
var midioutput = new midi.output();
console.log('port count:', midioutput.getPortCount());
console.log('port #0:', midioutput.getPortName(0)); 
midioutput.openPort(0);
//
// Set up song and sequencer
//

var song = new songmodule.Song();
var seq = new sequencermodule.Sequencer( { 
	ppqn: 48,
	song: song,
	sendMidi: function(arg) { 
		midioutput.sendMessage(arg);
	}
} );

//
// Set up device controller
//

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
	for( k in staticfiles ) {	
		var file = staticfiles[k];	
		if( req.url != file.url ) continue;
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
	var sock = socket;
	(function(){
		var dc = new socketdevicecontrollermodule.SocketDeviceController({ sequencer: seq, socket: sock });
		var timer = setInterval( function() { dc.update(); }, 30 );
		sock.on('disconnect', function () {
			console.log('disconnect.');
    		// sockets.emit('user disconnected');
			clearTimeout(timer);
  		});
	})();
});


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
}

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

/* while( !loaded ) {
	// vänta på laddad klart.
	// console.log('loading...');
} */


setInterval(function() { doSave(); },10000);


//
// Set up sequence player
// 

seq.player = playermodule.Player( { ppqn: 48, callback: function(arg) { seq.step(arg); } } );

console.log('starting playback.');
seq.player.startTimer();

console.log( 'App initialized, listening for connections ... ' ); 
app.listen(1200);
