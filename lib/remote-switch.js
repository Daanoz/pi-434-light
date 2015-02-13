var wpi = require('wiring-pi');

var RemoteSwitch = function(pin, perioduSec, repeats) {
	if(RemoteSwitch.pinMode == "phys") {
		wpi.wiringPiSetupSys();
	} else {
		wpi.setup(RemoteSwitch.pinMode);
	}
	wpi.pinMode(pin, wpi.OUTPUT);
	wpi.digitalWrite(pin, wpi.LOW);

	this.send = function(telegramData) {
		var data = encodeTelegram(telegramData);
			
		//Convert the base3-code to base4, to avoid lengthy calculations when transmitting.. Messes op timings.
		var dataBase4 = 0;		
		for (var i = 0; i < 12; i++) {
			dataBase4 <<= 2;
			dataBase4 |= (data%3);
			data /= 3;
		}
		
		var loops = 5 << (repeats & 7);
		for (var j = 0; j < loops; j++) {			
			
			//Use data-var as working var
			data = dataBase4;
		
			for (var i = 0; i < 12; i++) {
				switch (data & 3) { // 3 = B11
					case 0:
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec * 3);
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec * 3);
						break;
					case 1:			
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec);
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec);
						break;
					case 2: //AKA: X or float	
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec * 3);
						wpi.digitalWrite(pin, wpi.HIGH);
						delayMicroseconds(perioduSec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						delayMicroseconds(perioduSec);
						break;
				}
				//Next trit
				data >>= 2;
			}
			
			//Send termination/synchronisation-signal. Total length: 32 periods
			wpi.digitalWrite(pin, wpi.HIGH);
			delayMicroseconds(perioduSec);
			wpi.digitalWrite(pin, wpi.LOW);
			delayMicroseconds(perioduSec * 31);
		}
		wpi.digitalWrite(pin, wpi.LOW);
	};
	function delayMicroseconds(uSdelay)
	{
  		while(uSdelay > 99) {
    			uSdelay -= 100;
			wpi.delayMicroseconds(99);
  		}
  		wpi.delayMicroseconds(uSdelay);
	}

	function encodeTelegram(trits) {
		var data = 0;
		for (var i = 0; i < 12; i++) {
			data *= 3;
			data += trits[i];
		}
		return data;
	};
}
RemoteSwitch.pinMode = 'wpi';
module.exports = RemoteSwitch;
