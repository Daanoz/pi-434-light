var lightC = require('pi-434-light');

lightC.setPinMode('phys');
var kaku = lightC.kaku(17);

var channel = 'A';
var device = 2;

var state = 1;

setInterval(function() {
	kaku.sendSwitch(channel, device, state);
  	state = +!state;
}, 2000);