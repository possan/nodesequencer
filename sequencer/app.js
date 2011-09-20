

var bpm = 150.0;
console.log('bpm = ',bpm);

var bps;

var spb;

var ppqn = 96;
var spt;

calcticks = function() {
 	bps = bpm / 60.0;
	spb = 1.0 / (4 * bps)
	spt = spb / ppqn;
	console.log('bpm:',bpm,'bps:',bps,'spb:',spb,'spt:',spt);
}

calcticks();

var http = require('http');
var microtime = require('microtime');
var midi = require('midi');




function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var app = require('http').createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');

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
  socket.on('getstep', function (data) {
	socket.emit('step',{step:step/ppqn});
  });
});

app.listen(1200);

http.createServer(function (req, res) {
	console.log(req);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');

}).listen(1337, "127.0.0.1");

var midioutput = new midi.output();
console.log('port count:',midioutput.getPortCount());
console.log('port #0:',midioutput.getPortName(0)); 
midioutput.openPort(0);

var lt = 0;
var nt = 0;
var step = -1;

var vclock = 0;
var playclock = 0;

setInterval( function() {

	var t = microtime.nowDouble();
	if( lt == 0 )
		lt = t;
		
	var dt = t - lt;
	// console.log('vclock',vclock,'dt',dt);
	vclock += dt;
	lt = t;
	
	if( dt <= 0 )
		return;
	
	while( playclock < vclock ) {

		// console.log('step',step);	
		
		var ppqnstep = step % ppqn;
		var rsp = Math.floor( step / ppqn );
			
		if( ppqnstep == 0 ) {
		
		//	console.log('step',rsp,'at tick', t);	
		 	if( rsp % 4 == 0 ) {
				midioutput.sendMessage([0x90,36, 100]);
				midioutput.sendMessage([0x80,36,0]);
			}
			else if (rsp % 2 == 0 ) {
				midioutput.sendMessage([0x90,43,100]);
				midioutput.sendMessage([0x80,43,0]);
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
		if( ppqnstep == ppqn*3/4 ) {
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

		step ++;
		playclock += spt;
	}

}, 3 );

console.log('Server running at http://127.0.0.1:1337/');



