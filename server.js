var http = require('http');
var WSServer = require('websocket').server;
var fs = require('fs');
var url = require('url');
var path = require('path');
var indexHtml = fs.readFileSync('index.html');

var documentRoot = '/usr/local/node/seagull2';

var mimeTypes = {
	'.js' : 'text/javascript',
	'.html' : 'text/html',
	'.css' : 'text/css',
};

var plainHttpServer = http.createServer(function (req, res) {
	var methodType = req.method;
	if (methodType == 'GET') {
		doGet(req, res);
	} else if (methodType == 'POST') {
		doPost(req, res);
	}
	
}).listen(1337);

function doGet(req, res) {
	var headers;
	var reqUrl = decodeURI(req.url);

	if (reqUrl === '/') {
		headers = {
			'content-Type' : 'text/html'
		};
		res.writeHead(200, headers);
		res.end(indexHtml);
	} else if (reqUrl === '/favicon.ico') {
		return;
	} else {
		var filename = documentRoot + reqUrl;
		var data = fs.readFileSync(filename);
		headers = {
			'Content-Type' : mimeTypes[path.extname(filename)]
		};
		res.writeHead(200, headers);
		res.end(data);
	}
}

function doPost(req, res) {
	var reqUrl = decodeURI(req.url);

	// TODO
	return;
}

var webSocketServer = new WSServer({
				httpServer : plainHttpServer
			});

var connections = [];
var messages = [];
webSocketServer.on('request', function(req) {
	req.origiin = req.origin || '*';
	var websocket = req.accept(null, req.origiin);
	connections.push(websocket);
	websocket.on('message', function(data) {
		var param = JSON.parse(data.utf8Data);
		var name = param['name'];
		var message = param['message'];
		var text = name + " : " + message;
		//messages.push(text);
		//var resParam = generateMessage(messages);
		for (var i = 0; i < connections.length; i++) {
			if (!connections[i].closed) {
				connections[i].sendUTF(text);
			}
		}
	});

	websocket.on('close', function(code, desc) {
		console.log('接続解除 : ' + code + ' - ' + desc);
	});
});

function generateMessage(messages) {
	var result = "";
	for (var i = 0; i < messages.length; i++) {
		result = result + messages[i] + "\n";
	}
	return result;
}
