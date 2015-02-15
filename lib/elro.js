var RemoteSwitch = require('./remote-switch.js');

module.exports = function(pin, periodusec) {
	var remoteSwitch = new RemoteSwitch(pin, periodusec || 320, 3);

	this.sendSwitch = function(systemCode, device, on) { 
		var trits = [];
		systemCode = parseInt(systemCode);
		device = device.charCodeAt(0);
		device -= 65;

		for (var i = 0; i < 5; i++) {
			//bits 0-4 contain address (2^5=32 addresses)
			trits[i] = (systemCode & 1)?0:2;
			systemCode >>= 1;

			//bits 5-9 contain device. Only one trit has value 0, others have 2 (float)!
			trits[i+5] = (i == device?0:2);
	    }

		//switch on or off
		trits[10] = (on?0:2);
		trits[11] = (!on?0:2);
		trits[12] = 0;
		trits[13] = 2;
		trits[14] = 2;
		trits[15] = 2;

		remoteSwitch.send(trits);
	};
}
