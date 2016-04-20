var http = require('http');
var fs = require('fs');
var port = process.env.PORT || 8000;
var messages = [];
//var numUsers = 0;

var server = http.createServer(function(request, response) {
    fs.readFile('index.html', 'utf-8', function(error, data){
	response.writeHead(200, {'content-type': 'text/html'});
	response.write('<script>var port=' + port + '</script>');
	response.write(data);
	response.end();
    })
});

server.listen(PORT, function(){
	console.log('Listening on port ' + port + "...");
});

// io is the socket.io module
var io = require('socket.io').listen(server);

// add an event listener to the socket objects
// when someone sends a message  to the server, emit a message to all clients
// when does a message get sent to the server? when sendMessage() gets called by someone submitting the form
io.sockets.on('connect', function(socket){
	//numUsers++;
	// someone connected, and that someone is called socket
    console.log('Someone connected to the server.');

    // send missed messages to the client
    for (i=0; i<messages.length; i++){
    	document.getElementById('chat-window').innerHTML +=
    	'<div class="message">' + messages[i].message + ' &mdash; ' + messages[i].name + '<span> ' + messages[i].date + '</span></div>';
    }

    socket.on('message_to_server', function(data){
		io.sockets.emit('message_to_client', {
			message: data.message,
			name: data.name,
			date: data.date
		});
		messages.push(data);
    });
});
