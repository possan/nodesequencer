//
//
//

C = require('./constants').C;

NewPatternsScreen = function(opts) {
	var _host = null;

	var activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('CUE PATTERNS');
	};

	var handleButton = function(id) {
		if (id == C.Keys.KNOB2_UP)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					1, 0, 15);
		if (id == C.Keys.KNOB2_DN)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					-1, 0, 15);
		if (id == C.Keys.KNOB3_UP)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, 1, 0, 15);
		if (id == C.Keys.KNOB3_DN)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, -1, 0, 15);
		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {
			var row = (id - C.Keys.PAD0) >> 2;
			var col = (id - C.Keys.PAD0) & 3;
			var trkindex = (_host.state.currenttrack + row) % 16;
			var pat = (_host.state.currentpattern + col) % 16;
			_host.sequencer.cuePattern(trkindex, pat);
		}
	};

	var update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor(s) % 4;
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		for ( var i = 0; i < 16; i++) {
			var strk = _host.song.getTrack(_host.state.currenttrack);
			var sstp = strk.getPattern(i);
			_host.display.leds[C.Leds.PAD0 + i] = sstp.enabled;
		}
		var ps = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		for ( var t = 0; t < 4; t++) {
			var trkindex = (_host.state.currenttrack + t) % 16;
			var strk = _host.song.getTrack(trkindex);
			for ( var p = 0; p < 4; p++) {
				var patindex = (_host.state.currentpattern + p) % 16;
				var stp = strk.getPattern(patindex);
				_host.display.leds[C.Leds.PAD0 + (t * 4) + p] = stp.enabled;
			}
			var cued = _host.sequencer.getCuedPattern(trkindex);
			var pos = _host.sequencer.getPlayingPattern(trkindex);
			if (cued != -1) {
				var x2 = cued - _host.state.currentpattern;
				if (x2 >= 0 && x2 < 4 && b == 0)
					_host.display.leds[C.Leds.PAD0 + (t * 4) + x2] = !_host.display.leds[C.Leds.PAD0
							+ (t * 4) + x2];
			} else if (pos != -1) {
				var x1 = pos - _host.state.currentpattern;
				if (x1 >= 0 && x1 < 4 && b == 0)
					_host.display.leds[C.Leds.PAD0 + (t * 4) + x1] = !_host.display.leds[C.Leds.PAD0
							+ (t * 4) + x1];
			}
		}
		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'CUE PATTERNS');
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + ' ');
		_host.display.lcdPrintAt(16, 3, 'PATT');
		_host.display.lcdPrintAt(16, 4, _host.state.currentpattern + '');
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				update();
				break;
			}
		}
	};
};

NewPatternsScreen2 = function(opts) {
	var _host = null;

	var activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('ENABLE PATTERNS');
	};

	var handleButton = function(id) {
		if (id == C.Keys.KNOB2_UP)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					1, 0, 15);
		if (id == C.Keys.KNOB2_DN)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					-1, 0, 15);
		if (id == C.Keys.KNOB3_UP)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, 1, 0, 15);
		if (id == C.Keys.KNOB3_DN)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, -1, 0, 15);
		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {
			var row = (id - C.Keys.PAD0) >> 2;
			var col = (id - C.Keys.PAD0) & 3;
			var trkindex = (_host.state.currenttrack + row) % 16;
			var strk = _host.song.getTrack(trkindex);
			var pat = (_host.state.currentpattern + col) % 16;
			var sstp = strk.getPattern(pat);
			sstp.enabled = !sstp.enabled;
		}
	};

	var update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor(s) % 4;
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		for ( var i = 0; i < 16; i++) {
			var strk = _host.song.getTrack(_host.state.currenttrack);
			var sstp = strk.getPattern(i);
			_host.display.leds[C.Leds.PAD0 + i] = sstp.enabled;
		}
		var ps = _host.sequencer.getPlayingPattern(_host.state.currenttrack);

		for ( var t = 0; t < 4; t++) {
			var trkindex = (_host.state.currenttrack + t) % 16;
			var strk = _host.song.getTrack(trkindex);

			for ( var p = 0; p < 4; p++) {
				var patindex = (_host.state.currentpattern + p) % 16;
				var stp = strk.getPattern(patindex);
				_host.display.leds[C.Leds.PAD0 + (t * 4) + p] = stp.enabled;
			}

			var cued = _host.sequencer.getCuedPattern(trkindex);
			var pos = _host.sequencer.getPlayingPattern(trkindex);
			if (cued != -1) {
				var x2 = cued - _host.state.currentpattern;
				if (x2 >= 0 && x2 < 4 && b == 0)
					_host.display.leds[C.Leds.PAD0 + (t * 4) + x2] = !_host.display.leds[C.Leds.PAD0
							+ (t * 4) + x2];
			} else if (pos != -1) {
				var x1 = pos - _host.state.currentpattern;
				if (x1 >= 0 && x1 < 4 && b == 0)
					_host.display.leds[C.Leds.PAD0 + (t * 4) + x1] = !_host.display.leds[C.Leds.PAD0
							+ (t * 4) + x1];
			}
		}

		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'ENABLE PATTERNS');
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + ' ');
		_host.display.lcdPrintAt(16, 3, 'PATT');
		_host.display.lcdPrintAt(16, 4, _host.state.currentpattern + '');
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				update();
				break;
			}
		}
	};
};

CopyPatternScreen = function(opts) {
	var _host = null;

	var activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('COPY PATTERN');
	};

	var _phase = 0;
	var _copyfromtrack = -1;
	var _copyfrompat = -1;

	var handleButton = function(id) {

		if (id == C.Keys.KNOB2_UP)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					1, 0, 15);

		if (id == C.Keys.KNOB2_DN)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					-1, 0, 15);

		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {

			if (_phase == 0) {
				_copyfromtrack = _host.state.currenttrack;
				_copyfrompat = id - C.Keys.PAD0;
				_phase = 1;
				_host.displaybumper.setMessage('PATTERN COPIED');
			} else if (_phase == 1) {
				var trk = _host.song.getTrack(_copyfromtrack);
				var pat = trk.getPattern(_copyfrompat);
				var trk2 = _host.song.getTrack(_host.state.currenttrack);
				var pat2 = trk.getPattern(id - C.Keys.PAD0);
				var json = pat.toJson();
				console.log('copy payload', json);
				pat2.parseJson(json);
				_phase = 0;
				_host.displaybumper.setMessage('PATTERN PASTED');
			}

			// var strk = _host.song.getTrack( _host.state.currenttrack );
			// var sstp = strk.getPattern( id-C.Keys.PAD0 );
			// sstp.enabled = !sstp.enabled;
			// _host.state.currentpattern = id;
		}
	};

	var update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor(s) % 4;
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		for ( var i = 0; i < 16; i++) {
			var strk = _host.song.getTrack(_host.state.currenttrack);
			var sstp = strk.getPattern(i);
			_host.display.leds[C.Leds.PAD0 + i] = sstp.enabled;
		}
		var ps = _host.sequencer.getPlayingPattern(_host.state.currenttrack);

		_host.display.lcdClear();
		if (_phase == 0) {
			_host.display.lcdPrintAt(1, 1, 'COPY FROM PATTERN');
		} else if (_phase == 1) {
			_host.display.lcdPrintAt(1, 1, 'PASTE TO PATTERN');
		}
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + ' ');

		if (ps != -1 && b == 0)
			_host.display.leds[C.Leds.PAD0 + ps] = !_host.display.leds[C.Leds.PAD0
					+ ps];
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				update();
				break;
			}
		}
	};
};

ClearPatternScreen = function(opts) {

	var _host = null;

	var activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('CLEAR PATTERN');
	};

	var _phase = 0;
	var _copyfromtrack = -1;
	var _copyfrompat = -1;

	var handleButton = function(id) {

		if (id == C.Keys.KNOB2_UP)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					1, 0, 15);

		if (id == C.Keys.KNOB2_DN)
			_host.state.currenttrack = Utils.addmod(_host.state.currenttrack,
					-1, 0, 15);

		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {

			if (_phase == 1) {
				if (_host.state.currenttrack != _copyfromtrack
						|| _host.state.currentpattern != _copyfrompat)
					_phase = 0;
			}

			if (_phase == 0) {
				_copyfromtrack = _host.state.currenttrack;
				_copyfrompat = id - C.Keys.PAD0;
				_phase = 1;
				_host.displaybumper.setMessage('CLICK AGAIN TO',
						'CLEAR PATTERN');
			} else if (_phase == 1) {
				// _copyfromtrack = _host.state.currenttrack;
				// _copyfrompat = id - C.Keys.PAD0;
				// _phase = 0;
				// _host.displaybumper.setMessage('PATTERN PASTED');
				_host.displaybumper.setMessage('PATTERN CLEARED');
				var trk = _host.song.getTrack(_copyfromtrack);
				var pat = trk.getPattern(_copyfrompat);
				pat.clearSteps();
			}

			// var strk = _host.song.getTrack( _host.state.currenttrack );
			// var sstp = strk.getPattern( id-C.Keys.PAD0 );
			// sstp.enabled = !sstp.enabled;
			// _host.state.currentpattern = id;
		}
	};

	var update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var b = Math.floor(s) % 4;
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		for ( var i = 0; i < 16; i++) {
			var strk = _host.song.getTrack(_host.state.currenttrack);
			var sstp = strk.getPattern(i);
			_host.display.leds[C.Leds.PAD0 + i] = sstp.enabled;
		}
		var ps = _host.sequencer.getPlayingPattern(_host.state.currenttrack);

		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'CLEAR PATTERN');
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + ' ');

		if (ps != -1 && b == 0)
			_host.display.leds[C.Leds.PAD0 + ps] = !_host.display.leds[C.Leds.PAD0
					+ ps];
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				update();
				break;
			}
		}
	};
};

exports.registerScreens = function(repo) {
	repo.push({
		name : 'mode2',
		factory : function() {
			return new NewPatternsScreen2();
		}
	});
	repo.push({
		name : 'mode2',
		factory : function() {
			return new CopyPatternScreen();
		}
	});
	repo.push({
		name : 'mode2',
		factory : function() {
			return new ClearPatternScreen();
		}
	});
	repo.push({
		name : 'mode2',
		factory : function() {
			return new NewPatternsScreen();
		}
	});
};
