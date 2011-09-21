var httpmodule = require('http');
var socketiomodule = require('socket.io');
var fs = require('fs');

var playermodule = require('./player.js');
var sequencermodule = require('./sequencer.js');
var devicecontrollermodule = require('./devicecontroller.js');


//
// Set up song and sequencer
//

var song = new sequencermodule.Song();
var seq = new sequencermodule.Sequencer( { ppqn: 48, song: song } );

//
// Set up device controller
//

var deviceController = new devicecontrollermodule.DeviceController({ sequencer: seq });

//
// Set up socket/http stuff
//

function handler (req, res) {
	var staticfiles = [
		{ url: '/jquery-1.6.4.min.js', filename: 'jquery-1.6.4.min.js', type: 'text/javascript' },
		{ url: '/style.css', filename: 'style.css', type: 'text/css' },
		{ url: '/index.html', filename: 'index.html', type: 'text/html' },
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

var app = httpmodule.createServer(handler);
var io = socketiomodule.listen(app);

io.sockets.on('connection', function (socket) {
	
  socket.emit('news', { hello: 'world' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('bpm', function (data) {
    console.log(data);
	bpm += data.bpmdelta;
	calcticks();
  });

	socket.on('deviceButtonDown', function(data) { deviceController.handleButtonDown(data.button); });
	socket.on('deviceButtonUp', function(data) { deviceController.handleButtonUp(data.button); });
	socket.on('deviceButtonClick', function(data) { deviceController.handleButtonClick(data.button); });

	setInterval(function(){
		// socket.emit('step',{step:step/ppqn});
	}, 100 );

	deviceController.addUpdateDeviceHandler( function( arg ) {
		socket.emit( 'updateDevice', arg );
	} );
	
});

app.listen(1200);

setInterval(function(){
	deviceController.step();
}, 15 );












//
// Set up MIDI
//

var midi = require('midi');
var midioutput = new midi.output();
console.log('port count:', midioutput.getPortCount());
console.log('port #0:', midioutput.getPortName(0)); 
midioutput.openPort(0);

function fakesong(arg){
	
	seq.step(arg);
	
	var ppqnstep = arg.step % arg.ppqn;
	var rsp = Math.floor( arg.step / arg.ppqn );
		
	if( ppqnstep == 0 ) {
	
	//	console.log('step',rsp,'at tick', t);	
	 	if( rsp % 4 == 0 ) {
			midioutput.sendMessage([0x90,36, 100]);
			midioutput.sendMessage([0x80,36,0]);
		}
		else if (rsp % 10 == 0 ) {
			midioutput.sendMessage([0x90,42,100]);
			midioutput.sendMessage([0x80,42,0]);
		}
		else if (rsp % 15 == 0 ) {
			midioutput.sendMessage([0x90,43,100]);
			midioutput.sendMessage([0x80,43,0]);
		}
		else if (rsp % 30 == 0 ) {
			midioutput.sendMessage([0x90,45,100]);
			midioutput.sendMessage([0x80,45,0]);
		}
		else if (rsp % 11 == 0 ) {
			midioutput.sendMessage([0x90,46,100]);
			midioutput.sendMessage([0x80,46,0]);
		}
		else if (rsp % 5 == 0 ) {
			midioutput.sendMessage([0x90,40,100]);
			midioutput.sendMessage([0x80,40,0]);
		}
		else if (rsp % 3 == 0 ) {
			midioutput.sendMessage([0x90,45,100]);
			midioutput.sendMessage([0x80,45,0]);
		}
		else if (rsp % 2 == 0 ) {
			midioutput.sendMessage([0x90,43,100]);
			midioutput.sendMessage([0x80,43,0]);
		}

	 	if( rsp % 4 == 0 ) {
			midioutput.sendMessage([0x91,36, 100]);
		}
	 	else if( rsp % 4 == 2 ) {
			midioutput.sendMessage([0x91,48, 100]);
		}
		else if( rsp % 4 == 3 ) {
			midioutput.sendMessage([0x91,48, 100]);
		}
	}
	
	if( ppqnstep == arg.ppqn*3/4 ) {
	 	if( rsp % 4 == 0 ) {
			midioutput.sendMessage([0x81,36,0]);
		}
	 	else if( rsp % 4 == 2 ) {
			midioutput.sendMessage([0x81,48,0]);
		}
		else if( rsp % 4 == 3 ) {
			midioutput.sendMessage([0x81,48,0]);
		}
	}
}

//
// Set up sequence player
// 

var player = playermodule.Player( { ppqn: 48, callback: fakesong } );
player.startTimer();


