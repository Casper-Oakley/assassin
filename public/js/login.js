var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
window.onload = function(){
	document.cookie = "name=";
	document.getElementById('button').onclick = function(){
		var type1 = 'login';
		var name1 = document.getElementById('name').value;
		var pass1 = document.getElementById('pass').value;
		var jsonSend = {name: name1,pass: pass1,type: type1};
		console.log(jsonSend.name);
		ws.send(JSON.stringify(jsonSend));
	};
};
ws.onmessage = function(message){
	if(message.data=='success'){
		document.cookie=("name="+document.getElementById('name').value+"; path=/");
		window.location.replace("/userhub");
	}
	else{
		alert("Error. Incorrect User/Pass.");
	}
};
