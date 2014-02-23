var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
ws.onopen = function(event){
};
window.onload = function(){
	document.getElementById('button').onclick = function(){
		var type1 = 'login';
		var name1 = document.getElementById('user').value;
		var pass1 = document.getElementById('pass').value;
		var jsonSend = {name: name1,pass: pass1,type: type1};
		console.log(jsonSend.name);
		ws.send(JSON.stringify(jsonSend));
	};
};
