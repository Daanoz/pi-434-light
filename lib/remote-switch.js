var wpi = require('wiring-pi');

var RemoteSwitch = function(pin, perioduSec, repeats) {
	wpi.setup(RemoteSwitch.pinMode);
	wpi.pinMode(pin, wpi.OUTPUT);
	wpi.digitalWrite(pin, wpi.LOW);

	this.send = function(telegramData) {
		var data = encodeTelegram(telegramData);
		var periodusec = (unsigned long)data >> 23;
		var repeats = 5 << (((unsigned long)data >> 20) & 7); // 7 = B111
		data = data & 0xfffff; //truncate to 20 bit
			
		//Convert the base3-code to base4, to avoid lengthy calculations when transmitting.. Messes op timings.
		var dataBase4 = 0;
		
		for (var i = 0; i < 12; i++) {
			dataBase4 <<= 2;
			dataBase4 |= (data%3);
			data /= 3;
		}
		
		for (var j = 0; j < repeats; j++) {		
			//Sent one telegram		
			
			//Use data-var as working var
			data = dataBase4;
		
			for (var i = 0; i < 12; i++) {
				switch (data & 3) { // 3 = B11
					case 0:
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec * 3);
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec * 3);
						break;
					case 1:
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec);
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec);
						break;
					case 2: //AKA: X or float
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec * 3);
						wpi.digitalWrite(pin, wpi.HIGH);
						wpi.delayMicroseconds(periodusec * 3);
						wpi.digitalWrite(pin, wpi.LOW);
						wpi.delayMicroseconds(periodusec);
						break;
				}
				//Next trit
				data >>= 2;
			}
			
			//Send termination/synchronisation-signal. Total length: 32 periods
			wpi.digitalWrite(pin, wpi.HIGH);
			wpi.delayMicroseconds(periodusec);
			wpi.digitalWrite(pin, wpi.LOW);
			wpi.delayMicroseconds(periodusec * 31);
		}
	};
	function encodeTelegram(trits) {
		var data = 0;
		for (var i = 0; i < 12; i++) {
			data *= 3;
			data += trits[i];
		}
		
		//Encode period duration
		//data |= (unsigned long)_periodusec << 23;
		data |= perioduSec << 23;
		
		//Encode repeats
		//data |= (unsigned long)_repeats << 20;
		data |= repeats << 20;
		
		return data;
	};
}
RemoteSwitch.pinMode = 'wpi';
module.exports = RemoteSwitch;