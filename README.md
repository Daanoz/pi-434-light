Node.js functions for switching radio controlled wall outlets written in JavaScript

Uses the wiring-pi bindings from [Eugenware](https://github.com/eugeneware/wiring-pi) & [Soarez](https://github.com/Soarez/node-wiring-pi)

Based on the C++ code written by [randysimons](http://randysimons.nl), [weetjewel](http://weejewel.tweakblogs.net/blog/8665/lampen-schakelen-met-een-raspberry-pi.html) and bugfix by [mouse86](http://eeo.tweakblogs.net/blog/11427/rpi2-bugfix-kaku-lampen)

### Currently supported modules
- [Klik Aan Klik Uit (kika)](http://www.klikaanklikuit.nl/home/)
- [Elro](http://www.elro.eu/en/products/cat/home-automation/home-control1/receivers-on-off1)
- Blokker
- [Impuls (action)](http://www.voordeelmuis.nl/img/gif/1246/1246690.gif)

### Requirements
- Node version 0.10.x (because of the wiringPi bindings)
- Raspberry PI (any model should work, B, B+, A, 2 B, etc.)
- 434Mhz transmitter, connected to [GPIO pins](http://wiringpi.com/wp-content/uploads/2013/03/gpio1.png) 5V, GRND(0V), and a data pin (I recommend WPI pin #0, as it in not HIGH (on) when the PI boots)

## Install

```
npm install daanoz/pi-434-light
```

## Generic usage

```javascript
var piLight = require('pi-434-light');
piLight.setPinMode('phys');
```

**setPinMode(mode)**

for usage click [here](https://github.com/eugeneware/wiring-pi/blob/master/DOCUMENTATION.md#setupmode)

*currently only 'phys' seems to be working*

```javascript
piLight.setPinMode('phys');
```

## Kaku control module

**piLight.kaku(pin, [period])**

pin = data pin of transmitter

period = bit interval, default: 370

```javascript
var kaku = piLight.kaku(17);
```

**kaku.sendSwitch(channel, device, state);**

channel = (char)one of the 16 channels [A - P]

device = (int)one of the 16 devices on the channel [1 - 16]

state = (boolean) true for on, false for off 

```javascript
kaku.sendSwitch('A', 2, true);
```

## Elro control module

**piLight.elro(pin, [period])**

pin = data pin of transmitter

period = bit interval, default: 320

```javascript
var elro = piLight.elro(17);
```

**elro.sendSwitch(channel, device, state);**

systemCode = (int)one of the 32 channels [1 - 32]

device = (char)one of the 5 devices on the channel [A - E]

state = (boolean) true for on, false for off 

```javascript
elro.sendSwitch(2, 'A', true);
```

## Impuls control module

**piLight.impuls(pin, [period])**

pin = data pin of transmitter

period = bit interval, default: 320

```javascript
var impuls = piLight.impuls(17);
```

**impuls.sendSwitch(channel, device, state);**

systemCode = (int)one of the 32 channels [1 - 32]

device = (char)one of the 5 devices on the channel [A - E]

state = (boolean) true for on, false for off 

```javascript
impuls.sendSwitch(2, 'A', true);
```
## Blokker control module

**piLight.blokker(pin, [period])**

pin = data pin of transmitter

period = bit interval, default: 320

```javascript
var blokker = piLight.blokker(17);
```

**blokker.sendSwitch(device, state);**

device = (int)one of the 16 devices [1 - 16]

state = (boolean) true for on, false for off 

```javascript
blokker.sendSwitch(2, true);
```

## Contributing

Feel free to contribute!