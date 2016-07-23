var http = require('http');
var server = http.createServer(function(){

});

server.listen(1234,function(){
	console.log('Server is running on port 1234.');
});

//web sockets server

var webSocketServer = require('websocket').server;
var wsServer = new webSocketServer({httpServer: server});

var count = 0;
var clients ={};

wsServer.on('request',function(req){
	//Accepting conection
	var connection = req.accept('echo-protocol', req.origin);
	var id = count++;
	clients[id] = connection;
	console.log('New connection accepted: '+ id);

	//Recievieng message
	connection.on('message', function(message){
		var msString = message.utf8Data;
		//Broadcasting
		for(var client in clients){
			clients[client].sendUTF(msString);
		}
	});

	//Connection exit
	connection.on('close', function(reasonCode, description){
		delete clients[id];
		console.log('Client' + id + ' disconected. ' + 'Adress: ' + connection.remoteAdress)
	});
});
