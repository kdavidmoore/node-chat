var http = require('http');
var fs = require('fs');
var port = process.env.PORT || '8000';

var server = http.createServer(function(request, response) {
    fs.readFile('index.html', 'utf-8', function(error, data){
	response.writeHead(200, {'content-type': 'text/html'});
	response.write('<script>var port=' + port + '</script>');
	response.write(data);
	response.end();
    })
});

var io = require('socket.io').listen(server);

var messages = [];
var numUsers = 0;
// add an event listener to the socket objects
// when someone sends a message  to the server, emit a message to all clients
// when does a message get sent to the server? when sendMessage() gets called by someone submitting the form
io.sockets.on('connect', function(socket){
	numUsers++;
    console.log('Someone connected to the server.');
    socket.on('message_to_server', function(data){
		io.sockets.emit('message_to_client', {
			message: data.message,
			name: data.name,
			date: data.date
		});
		messages.push(data.message);
    });
});

server.listen(8000);
console.log('Listening on port 8000...');
