var ws;

$(document).ready(function() {
	ws = new WebSocket("ws://192.168.11.3:1337");
	ws.onmessage = function(e) {
		var data = e.data;
		$("#messageBody").append("<p>" + data + "</p>");
	};
	ws.onclose = function(e) {
		console.log("切断", e.code + ' - ' + e.type);
	};
	console.log('test console');
});

function sendMessage() {
	var name = $("#name").val();
	var message = $("#input_message").val();
	$("#input_message").val("");
	var param = {};
	param['name'] = name;
	param['message'] = message;
	ws.send(JSON.stringify(param));
}
