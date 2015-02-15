var RemoteSwitch = require('./remote-switch.js');

module.exports = function(pin, periodusec) {
	var remoteSwitch = new RemoteSwitch(pin, periodusec || 230, 3);

	this.sendSwitch = function(device, on) { 
		var trits = [0];
		device = parseInt(device);
		device--;
	
		for (var i = 1; i < 4; i++) {
			//Bits 1-3 contain device 
			trits[i] = (device & 1)?0:1;          
			device >>= 1;
	    }
	
		//switch on or off
		trits[8] = (on?1:0);

		remoteSwitch.send(trits);
	};
}
