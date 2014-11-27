var http = require('http');
var serialPort = require('serialport');

var commands = {
    'stop':    '#M0',
    'forward': '#M1',
    'back':    '#M2',
    'right':   '#M3',
    'left':    '#M4',
    'green':   '#M5',
    'yellow':  '#M6',
    'blue':    '#M7',
    'red':     '#M8',
    'push':    '#M9',
}

var portName = '/dev/ttyAMA0';
var serial = new serialPort.SerialPort(portName, {
    baudRate: 57600,
}, false);

serial.open(function (err) {
    if (err) {
        console.log('failed to open: ' + err);
        throw err;
    }
    console.log('open ' + portName);
});

http.createServer(function (req, res) {
    if (req.method == 'GET') {
        p = req.url.split('/');
        cmd = p[p.length - 1];
        if (cmd in commands) {
          serial.write(commands[cmd]);
          console.log('Invoking ' + cmd);
          res.statusCode = 200;
        } else {
          console.log('Command not found: ' + cmd);
          res.statusCode = 404;
        }
    } else {
      console.log('Bad request: ' + req.method);
      res.statusCode = 400;
    }
    res.end();
}).listen(8080, '0.0.0.0');
