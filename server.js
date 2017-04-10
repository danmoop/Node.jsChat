var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var online_counter = 0;

server.listen(1337);

console.log("---------------------------");
console.log("Server started");

app.get('/', function(request, response){
	response.sendFile(__dirname + "/index.html");
});

io.sockets.on('connection', function(socket){

	console.log("---------------------------");
	Client_ID = Math.random();
	online_counter++;
	console.log("New connection: "+Client_ID);
	console.log("Users online: "+online_counter);

	socket.on('disconnect', function(){
		console.log("---------------------------");
		console.log("Disconnected: "+Client_ID);
		online_counter--;
		console.log("Users online: "+online_counter);
	});

	socket.on('requestSendMsg', function(data, nick){
		if(data == "/clear") {
			for(var i = 0; i < 50; i++) {
				console.log("");
			}
		}

		if(data != "/clear" && nick != "") {
			console.log("Message : " + data);
			io.sockets.emit('messageSend', data, nick);
		}
	});

	socket.on('chatClear', function(){
		console.log(Client_ID + " cleared the chat");
	});

	socket.on('consoleClear', function(){
		for(var i = 0; i < 50; i++) {
			console.log("");
		}
	});

	socket.on('requestPeopleOnline', function(){
		io.sockets.emit('setPeopleOnline', online_counter);
	});

});