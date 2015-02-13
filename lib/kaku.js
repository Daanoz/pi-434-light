var RemoteSwitch = require('./remote-switch.js');

module.exports = function(pin, periodusec) {
	var remoteSwitch = new RemoteSwitch(pin, periodusec || 375, 3);

	this.sendSwitch = function(address, device, on) { 
		var trits = [];
		address = address.charCodeAt(0);
		address -= 65;
		device -= 1;
		
		for (var i = 0; i < 4; i++) {
			//bits 0-3 contain address (2^4 = 16 addresses)
			trits[i] = (address & 1)?2:0;          
			address >>= 1;
			
			//bits 4-8 contain device (2^4 = 16 addresses)
			trits[i+4] = (device & 1)?2:0;          
			device >>= 1;
	    }
		
		//bits 8-10 seem to be fixed
		trits[8] = 0;
		trits[9] = 2;
		trits[10] = 2;
		
		//switch on or off
		trits[11] = (on?2:0);

		remoteSwitch.send(trits);
	};
	this.sendGroupSwitch = function(address, group, device, on) {

		var trits = [];
		address = address.charCodeAt(0);
		address -= 65;
		device  -= 1;
		group   -=1;
		
		//address. M3E Pin A0-A3
		for (var i = 0; i < 4; i++) {
			//bits 0-3 contain address (2^4 = 16 addresses)
			trits[i] = (address & 1)?2:0;          
			address >>= 1;		
	    }
			
		//device. M3E Pin A4-A5
		for (var i = 4; i < 6; i++) {
			trits[i] = (device & 1)?2:0;          
			device >>= 1;
		}
		
		//group. M3E Pin A6-A7
		for (var i = 6; i < 8; i++) {
			trits[i]=(group & 1)?2:0;          
			group>>=1;
		}
		
		//bits 8-10 are be fixed. M3E Pin A8/D0-A10/D2
		trits[8] = 0;
		trits[9] = 2;
		trits[10] = 2;
		
		//switch on or off, M3E Pin A11/D3
		trits[11] = (on?2:0);

		remoteSwitch.send(trits);
	};	
}
