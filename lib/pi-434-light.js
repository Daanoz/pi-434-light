var Kaku = require('./kaku.js');
var RemoteSwitch = require('./remote-switch.js');

module.exports = {
	setPinMode: function setPinMode(mode) {
		RemoteSwitch.pinMode = mode;
	},
	elro: function elro() {

	},
	kaku : function kaku(pin, periodusec) {
		return new Kaku(pin, periodusec);
	}
};