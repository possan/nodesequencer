//
//
//

C = require('./constants').C;
Utils = require('./utils').Utils;

DrumEditorScreen = function() {
	var _host = null;
	var redrumkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2', 'FX3', 'FX4', 'HH',
			'HH2', 'FX5' ];
	var kongkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2', 'FX3', 'HH', 'HH2', 'FX4',
			'FX5', 'FX6', 'FX7', 'FX8', 'FX9', 'F10', 'F11' ];
	var drumkeys = redrumkeys;
	var keyprefix = [ 'C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#',
			'A-', 'A#', 'B-' ];
	var _getNoteName = function(id, mode) {
		if (mode == 'drum') {
			var k = id - 36;
			if (k >= 0 && k < drumkeys.length)
				return drumkeys[k];
			// return "#"+id;
		}
		var o = Math.floor(id / 12);
		var k = id % 12;
		return keyprefix[k] + '' + o;
	};

	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('TRACK #' + _host.state.currenttrack,
				'DRUMMACHINE');
	};

	var _handleButton = function(id) {
		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);
		if (id == C.Keys.KNOB0_UP) {
			_host.state.currentnote++;
			if (_host.state.currentnote > 48)
				_host.state.currentnode = 36;
		}
		if (id == C.Keys.KNOB0_DN) {
			_host.state.currentnote--;
			if (_host.state.currentnote < 36)
				_host.state.currentnode = 48;
		}
		if (id == C.Keys.KNOB1_UP) {
			trk.gate++;
			if (trk.gate > 127)
				trk.gate = 127;
		}
		if (id == C.Keys.KNOB1_DN) {
			trk.gate--;
			if (trk.gate < 1)
				trk.gate = 1;
		}
		if (id == C.Keys.KNOB3_UP)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, 1, 0, 15);
		if (id == C.Keys.KNOB3_DN)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, -1, 0, 15);
		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {
			var stpobj = pat.getStep(id - C.Keys.PAD0);
			var oldnotes = stpobj.getNotes();
			var any = false;
			for ( var k = 0; k < oldnotes.length; k++)
				if (oldnotes[k].n == _host.state.currentnote)
					any |= oldnotes[k].v > 0;
			stpobj.setNote(_host.state.currentnote, any ? 0 : 100);
		}
	};

	var _update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);
		var numbelow = 0;
		var numabove = 0;
		for ( var j = 0; j < 16; j++) {
			var stp = pat.getStep(j);
			var oldnotes = stp.getNotes();
			var any = false;
			for ( var k = 0; k < oldnotes.length; k++) {
				if (oldnotes[k].v > 0) {
					if (oldnotes[k].n == _host.state.currentnote)
						any = true;
					if (oldnotes[k].n < _host.state.currentnote)
						numbelow++;
					if (oldnotes[k].n > _host.state.currentnote)
						numabove++;
				}
			}
			_host.display.leds[C.Leds.PAD0 + j] = any;
		}
		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'DRUM EDITOR');
		_host.display.lcdPrintAt(1, 3, 'NOTE');
		_host.display.lcdPrintAt(6, 3, 'GATE');
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(16, 3, 'PATT');
		_host.display.lcdPrintAt(1, 4, _getNoteName(_host.state.currentnote,
				trk.type)
				+ '  ');
		_host.display.lcdPrintAt(6, 4, trk.gate + ' ');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + '  ');
		_host.display.lcdPrintAt(16, 4, _host.state.currentpattern + '  ');

		if (numabove > 0 && numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '*');
		else if (numabove > 0)
			_host.display.lcdPrintAt(4, 3, '+');
		else if (numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '-');

		if (pp == _host.state.currentpattern && trk.enabled && pat.enabled)
			_host.display.leds[C.Leds.PAD0 + ps] = !_host.display.leds[C.Leds.PAD0
					+ ps];
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				_handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				_activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				_update();
				break;
			}
		}
	};
};

PolySynthScreen = function() {
	var _host = null;
	var keyprefix = [ 'C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#',
			'A-', 'A#', 'B-' ];
	var _getNoteName = function(id, mode) {
		if (mode == 'drum') {
			var k = id - 36;
			if (k >= 0 && k < drumkeys.length)
				return drumkeys[k];
			// return "#"+id;
		}
		var o = Math.floor(id / 12);
		var k = id % 12;
		return keyprefix[k] + '' + o;
	};

	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('TRACK #' + _host.state.currenttrack,
				'POLY SYNTH');
	};

	var _handleButton = function(id) {

		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);

		if (id == C.Keys.KNOB0_UP) {
			_host.state.currentnote++;
			if (_host.state.currentnote > 48)
				_host.state.currentnode = 36;
		}
		if (id == C.Keys.KNOB0_DN) {
			_host.state.currentnote--;
			if (_host.state.currentnote < 36)
				_host.state.currentnode = 48;
		}

		if (id == C.Keys.KNOB1_UP) {
			trk.gate++;
			if (trk.gate > 127)
				trk.gate = 127;
		}
		if (id == C.Keys.KNOB1_DN) {
			trk.gate--;
			if (trk.gate < 1)
				trk.gate = 1;
		}

		if (id == C.Keys.KNOB3_UP)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, 1, 0, 15);
		if (id == C.Keys.KNOB3_DN)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, -1, 0, 15);

		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {
			var stpobj = pat.getStep(id - C.Keys.PAD0);
			var oldnote = stpobj.getNote(_host.state.currentnote);
			if (oldnote != null && oldnote.v > 10)
				stpobj.clearNote(_host.state.currentnote);
			else
				stpobj.addNote(_host.state.currentnote, 100);
		}
	};

	var _update = function() {
		var s = _host.sequencer.getPlayingGlobalStep();
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);
		var numbelow = 0;
		var numabove = 0;
		for ( var j = 0; j < 16; j++) {
			var stp = pat.getStep(j);
			var oldnotes = stp.getNotes();
			for ( var k = 0; k < oldnotes.length; k++) {
				if (oldnotes[k].v > 0) {
					if (oldnotes[k].n < _host.state.currentnote)
						numbelow++;
					if (oldnotes[k].n > _host.state.currentnote)
						numabove++;
				}
			}
			var oldnote = stp.getNote(_host.state.currentnote);
			_host.display.leds[C.Leds.PAD0 + j] = (oldnote != null && oldnote.v > 10);
		}
		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'DRUM EDITOR');
		_host.display.lcdPrintAt(1, 3, 'NOTE');
		_host.display.lcdPrintAt(6, 3, 'GATE');
		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(16, 3, 'PATT');
		_host.display.lcdPrintAt(1, 4, _getNoteName(_host.state.currentnote,
				trk.type)
				+ '  ');
		_host.display.lcdPrintAt(6, 4, trk.gate + ' ');
		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + '  ');
		_host.display.lcdPrintAt(16, 4, _host.state.currentpattern + '  ');

		if (numabove > 0 && numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '*');
		else if (numabove > 0)
			_host.display.lcdPrintAt(4, 3, '+');
		else if (numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '-');

		if (pp == _host.state.currentpattern && trk.enabled && pat.enabled)
			_host.display.leds[C.Leds.PAD0 + ps] = !_host.display.leds[C.Leds.PAD0
					+ ps];
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				_handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				_activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				_update();
				break;
			}
		}
	};
};

MonoSynthScreen = function() {
	var _host = null;
	var redrumkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2', 'FX3', 'FX4', 'HH',
			'HH2', 'FX5' ];
	var kongkeys = [ 'BD', 'SD', 'SD2', 'FX', 'FX2', 'FX3', 'HH', 'HH2', 'FX4',
			'FX5', 'FX6', 'FX7', 'FX8', 'FX9', 'F10', 'F11' ];
	var drumkeys = redrumkeys;
	var keyprefix = [ 'C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#',
			'A-', 'A#', 'B-' ];

	var _step = 0;

	var _getNoteName = function(id, mode) {
		if (mode == 'drum') {
			var k = id - 36;
			if (k >= 0 && k < drumkeys.length)
				return drumkeys[k];
			// return "#"+id;
		}
		var o = Math.floor(id / 12);
		var k = id % 12;
		return keyprefix[k] + '' + o;
	};

	var _activate = function(host) {
		_host = host;
		_host.displaybumper.setMessage('TRACK #' + _host.state.currenttrack,
				'MONO SYNTH');
	};

	var _handleButton = function(id) {

		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);

		if (id == C.Keys.KNOB0_UP || id == C.Keys.KNOB0_DN) {

			var stpobj = pat.getStep(_step);
			var oldnotes = stpobj.getNotes();
			var note = 36;
			var vel = 0;
			for ( var k = 0; k < oldnotes.length; k++) {
				note = oldnotes[k].n;
				vel = oldnotes[k].v;
			}

			if (id == C.Keys.KNOB0_UP)
				note++;
			if (id == C.Keys.KNOB0_DN)
				note--;

			stpobj.clearStep();
			stpobj.setNote(note, vel);

		}

		/*
		if (id == C.Keys.KNOB1_UP) {
			trk.gate++;
			if (trk.gate > 127)
				trk.gate = 127;
		}
		if (id == C.Keys.KNOB1_DN) {
			trk.gate--;
			if (trk.gate < 1)
				trk.gate = 1;
		}
		*/

		if (id == C.Keys.KNOB1_DN) {
			_step --;
			if (_step < 0)
				_step = 15;
		}
		if (id == C.Keys.KNOB1_UP) {
			_step ++;
			if (_step > 15)
				_step = 0;
		}


		if (id == C.Keys.KNOB3_UP)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, 1, 0, 15);
		if (id == C.Keys.KNOB3_DN)
			_host.state.currentpattern = Utils.addmod(
					_host.state.currentpattern, -1, 0, 15);

		if (id >= C.Keys.PAD0 && id <= C.Keys.PAD15) {

			_step = id - C.Keys.PAD0;

			var stpobj = pat.getStep(_step);
			var oldnotes = stpobj.getNotes();
			var note = 36;
			var vel = 0;
			for ( var k = 0; k < oldnotes.length; k++) {
				note = oldnotes[k].n;
				vel = oldnotes[k].v;
			}

			if (vel > 0) {
				stpobj.clearStep();
				stpobj.setNote(note, 0);
			} else {
				stpobj.clearStep();
				stpobj.setNote(note, 100);
			}
		}
	};

	var _update = function() {
		if (_host === null) return;
		if (typeof(_host) === 'undefined') return;
		if (typeof(_host.sequencer) === 'undefined') return;
		var s = _host.sequencer.getPlayingGlobalStep();
		var pp = _host.sequencer.getPlayingPattern(_host.state.currenttrack);
		var ps = _host.sequencer
				.getPlayingPatternStep(_host.state.currenttrack);
		var trk = _host.song.getTrack(_host.state.currenttrack);
		var pat = trk.getPattern(_host.state.currentpattern);
		var numbelow = 0;
		var numabove = 0;
		for ( var j = 0; j < 16; j++) {
			var stp = pat.getStep(j);
			var oldnotes = stp.getNotes();// _host.state.currentnote );
			var any = false;
			for ( var k = 0; k < oldnotes.length; k++) {
				if (oldnotes[k].v > 0) {
					any = true;
					if (oldnotes[k].n < _host.state.currentnote)
						numbelow++;
					if (oldnotes[k].n > _host.state.currentnote)
						numabove++;
				}
			}
			_host.display.leds[C.Leds.PAD0 + j] = any;
		}
		_host.display.lcdClear();
		_host.display.lcdPrintAt(1, 1, 'MONOSYNTH EDITOR');

		_host.display.lcdPrintAt(6, 3, 'STEP');
		_host.display.lcdPrintAt(6, 4, '' + _step);

		_host.display.lcdPrintAt(11, 3, 'TRAK');
		_host.display.lcdPrintAt(16, 3, 'PATT');

		var stp = pat.getStep(_step);
		var oldnotes = stp.getNotes();
		var note = 0;
		var vel = 0;
		for ( var k = 0; k < oldnotes.length; k++) {
			note = oldnotes[k].n;
			vel = oldnotes[k].v;
		}
		if (vel > 0) {
			_host.display.lcdPrintAt(1, 3, 'NOTE');
			_host.display.lcdPrintAt(1, 4, _getNoteName(note, trk.type) + '  ');
		}
		// _host.display.lcdPrintAt( 6, 4, ''+vel );

		_host.display.lcdPrintAt(11, 4, _host.state.currenttrack + '  ');
		_host.display.lcdPrintAt(16, 4, _host.state.currentpattern + '  ');

		if (numabove > 0 && numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '*');
		else if (numabove > 0)
			_host.display.lcdPrintAt(4, 3, '+');
		else if (numbelow > 0)
			_host.display.lcdPrintAt(4, 3, '-');

		if (pp == _host.state.currentpattern && trk.enabled && pat.enabled)
			_host.display.leds[C.Leds.PAD0 + ps] = !_host.display.leds[C.Leds.PAD0
					+ ps];
	};

	return {
		handleEvent : function(event) {
			switch (event.type) {
			case C.Events.BUTTON_CLICK:
				_handleButton(event.button);
				break;
			case C.Events.UI_ACTIVATE:
				_activate(event.host);
				break;
			case C.Events.UI_UPDATE:
				_update();
				break;
			}
		}
	};
};

MachineTypeScreen = function() {

	var editors = {};
	editors["drum"] = new DrumEditorScreen();
	editors["monosynth"] = new MonoSynthScreen();
	editors["synth"] = new PolySynthScreen();

	var _host = null;

	var _activate = function(host) {
		_host = host;
		var trk = _host.song.getTrack(_host.state.currenttrack);
		if (editors[trk.type])
			editors[trk.type].handleEvent({
				type : C.Events.UI_ACTIVATE,
				host : _host
			});
	};

	var _handleEvent = function(event) {
		switch (event.type) {
		case C.Events.UI_ACTIVATE:
			_activate(event.host);
			break;
		case C.Events.BUTTON_CLICK:
			if (event.button == C.Keys.KNOB2_UP)
				_host.state.currenttrack = Utils.addmod(
						_host.state.currenttrack, 1, 0, 15);
			if (event.button == C.Keys.KNOB2_DN)
				_host.state.currenttrack = Utils.addmod(
						_host.state.currenttrack, -1, 0, 15);
			if (event.button == C.Keys.KNOB2_UP
					|| event.button == C.Keys.KNOB2_DN)
				_activate(_host);
			break;
		}

		var trk = _host.song.getTrack(_host.state.currenttrack);
		if (editors[trk.type])
			editors[trk.type].handleEvent(event);
	};

	return {
		handleEvent : _handleEvent
	};
};

exports.registerScreens = function(repo) {
	repo.push({
		name : 'mode0',
		factory : function() {
			return new MachineTypeScreen();
		}
	});
};
