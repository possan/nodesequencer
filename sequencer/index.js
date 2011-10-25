$(document).ready(function() {

	console.log('connecting...');

	console.log(location);

	var socket = io.connect('http://' + location.host);

	socket.on('step', function(data) {
		var s = Math.floor(data.step) % 16;
		$('#steplabel').html(s);
	});

	function bpm(delta) {
		socket.emit('bpm', {
			bpmdelta : delta
		});
	}
	
	
	console.log('wire events...');

	$('.clickable').each(function() {

		$(this).bind('mousedown', function() {
			socket.emit('deviceButtonDown', {
				button : parseInt(this.id.substring(6), 10)
			});
		});

		$(this).bind('mouseup', function() {
			socket.emit('deviceButtonUp', {
				button : parseInt(this.id.substring(6), 10)
			});
		});

		$(this).bind('click', function(event) {
			socket.emit('deviceButtonClick', {
				button : parseInt(this.id.substring(6), 10)
			});
			event.stopPropagation();
		});

		var lasttouchdown = 0;

		$(this).bind('touchstart', function(event) {
			socket.emit('deviceButtonClick', {
				button : parseInt(this.id.substring(6), 10)
			});
			event.stopPropagation();
		});

		$(this).bind('touchend', function(event) {
			event.stopPropagation();
		});

		$(this).bind('touchcancel', function(event) {
			event.stopPropagation();
		});

		$(document).bind('touchstart', function(event) {
			event.stopPropagation();
		});
	});

	$('.knob').each(function() {
		var self = this;
		console.log('init knob', self);

		var _lastv = 0;
		var _down = false;
		var _moved = false;

		$(self).bind('mousemove', function(event) {
			if (!self._down)
				return;

			event.stopPropagation();
			var o = $(self).offset();
			var h = $(self).height();
			var knobid = parseInt(this.id.substring(4), 10);
			var v = (event.pageY - (o.top)) / h;
			var d = v - self._lastv;

			if (d < -0.1) {
				socket.emit('deviceButtonClick', {
					button : 30 + 2 * knobid
				});
				self._lastv = v;
			} else if (d > 0.1) {
				socket.emit('deviceButtonClick', {
					button : 30 + 2 * knobid + 1
				});
				self._lastv = v;
			}

			self._moved = true;
		});

		$(self).bind('mousedown', function(event) {
			event.stopPropagation();
			var o = $(self).offset();
			var h = $(self).height();
			self._down = true;
			var v = (event.pageY - (o.top)) / h;
			self._lastv = v;
			self._moved = false;
		});

		$(self).bind('mouseup', function(event) {
			event.stopPropagation();
			self._down = false;
			if (!self._moved) {

				event.stopPropagation();
				var o = $(self).offset();
				var h = $(self).height();
				var knobid = parseInt(this.id.substring(4), 10);
				var v = (event.pageY - (o.top)) / h;

				if (v < 0.5) {
					socket.emit('deviceButtonClick', {
						button : 30 + 2 * knobid
					});
				} else if (v > 0.5) {
					socket.emit('deviceButtonClick', {
						button : 30 + 2 * knobid + 1
					});
				}

			}
		});

		$(self).bind('mouseout', function(event) {
			self._down = false;
		});
	});

	$(document).keydown(function(e) {
		console.log('keydown');
		console.log(e.keyCode, String.fromCharCode(e.keyCode));
		var fakebutton = -1;
		var fakeknob = -1;
		var fakeknobdir = 0;
		switch (e.keyCode) {
		// 49 50 51 52
		// 81 87 69 82
		// 65 83 68 70
		// 90 88 67 86
		case 49:
			fakebutton = 0;
			break;
		case 50:
			fakebutton = 1;
			break;
		case 51:
			fakebutton = 2;
			break;
		case 52:
			fakebutton = 3;
			break;
		case 81:
			fakebutton = 4;
			break;
		case 87:
			fakebutton = 5;
			break;
		case 69:
			fakebutton = 6;
			break;
		case 82:
			fakebutton = 7;
			break;
		case 65:
			fakebutton = 8;
			break;
		case 83:
			fakebutton = 9;
			break;
		case 68:
			fakebutton = 10;
			break;
		case 70:
			fakebutton = 11;
			break;
		case 90:
			fakebutton = 12;
			break;
		case 88:
			fakebutton = 13;
			break;
		case 67:
			fakebutton = 14;
			break;
		case 86:
			fakebutton = 15;
			break;
		// 54 55 56 57
		case 54:
			fakebutton = 20;
			break;
		case 55:
			fakebutton = 21;
			break;
		case 56:
			fakebutton = 22;
			break;
		case 57:
			fakebutton = 23;
			break;
		// 89 85 73 79
		// 72 74 75 76
		case 89:
			fakebutton = 30;
			fakeknob = 0;
			fakeknobdir = 1;
			break;
		case 85:
			fakebutton = 32;
			fakeknob = 1;
			fakeknobdir = 1;
			break;
		case 73:
			fakebutton = 34;
			fakeknob = 2;
			fakeknobdir = 1;
			break;
		case 79:
			fakebutton = 36;
			fakeknob = 3;
			fakeknobdir = 1;
			break;
		case 72:
			fakebutton = 31;
			fakeknob = 0;
			fakeknobdir = -1;
			break;
		case 74:
			fakebutton = 33;
			fakeknob = 1;
			fakeknobdir = -1;
			break;
		case 75:
			fakebutton = 35;
			fakeknob = 2;
			fakeknobdir = -1;
			break;
		case 76:
			fakebutton = 37;
			fakeknob = 3;
			fakeknobdir = -1;
			break;
		}
		console.log('keyboard triggered button ', fakebutton);
		console.log('keyboard triggered knob ', fakeknob, fakeknobdir);
		if (fakebutton != -1) {
			// event.preventDefault();
			socket.emit('deviceButtonClick', {
				button : fakebutton
			});
		} else if (fakeknob != -1) {
			// event.preventDefault();
			socket.emit('deviceKnobTurn', {
				knob : fakeknob,
				delta : fakeknobdir
			});
		}
	});

	var lcdbuffer = [];

	function clearLcd() {
		lcdbuffer = [];
		for ( var j = 0; j < 4; j++) {
			var row = [];
			for ( var i = 0; i < 20; i++)
				row.push(' ');
			lcdbuffer.push(row);
		}
	}

	function drawLcd() {
		var html = "";
		for ( var j = 0; j < 4; j++) {
			if (j > 0)
				html += "\n";
			for ( var i = 0; i < 20; i++) {
				var ch = lcdbuffer[j][i];
				html += ch;
			}
		}
		$('#lcd').html(html);
	}

	function innerAddLcd(x, y, data) {
		x--;
		y--;
		if (y < 0 || y > 4)
			return;
		for ( var j = 0; j < data.length; j++) {
			var x2 = x + j;
			if (x2 >= 0 && x2 < 20)
				lcdbuffer[y][x2] = data[j];
		}
	}

	function addLcd(x, y, data) {
		var arr = data.split('\n');
		for ( var j = 0; j < arr.length; j++)
			innerAddLcd(x, y + j, arr[j]);
	}

	clearLcd();
	drawLcd();

	socket.on('updateDevice', function(d) {
		if (d.type == 'led') {
			var el = $('#led' + d.led);
			if (d.on)
				el.addClass('on');
			else
				el.removeClass('on');
		} else if (d.type == 'lcd') {
			clearLcd();
			addLcd(1, 1, d.content);
			drawLcd();
		} else if (d.type == 'lcd-xy') {
			addLcd(d.column, d.row, d.content);
			drawLcd();
		} else if (d.type == 'lcd-clear') {
			clearLcd();
			drawLcd();
		} else {
			console.log('unhandled updateDevice-message', d);
		}
	});
});
