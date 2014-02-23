var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
ws.onopen = function(event){
};
window.onload = function(){
	document.getElementById('button').onclick = function(){
		var name1 = document.getElementById('user').value;
		var pass1 = document.getElementById('pass').value;
		var number1 = document.getElementById('number').value;
		var jsonSend = {name: name1,pass: pass1,number: number1};
		console.log(jsonSend.name);
		ws.send(JSON.stringify(jsonSend));
	};
};
