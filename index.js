var express = require('express');
var app = express();
var port = 3010;

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/dist'));

app.listen(port, function() {
	console.log('You may now browse to http://localhost:'+port+'.');
});
