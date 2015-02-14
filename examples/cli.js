var lightC = require('pi-434-light');

lightC.setPinMode('phys');
var kaku = lightC.kaku(17);

var channel = process.argv[2] || 'A';
var device = parseInt(process.argv[3]) || 1;
var state = (process.argv[4] === 'off')?false:true;

console.log("Switching " + channel + device + " to " + state?"on":"off");
kaku.sendSwitch(channel, device, state);
