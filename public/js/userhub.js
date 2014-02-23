var host = location.origin.replace(/^http/, 'ws');
var ws = new WebSocket(host);
window.onload = function(){
ws.onopen = function(event){
	var name1 = getCookie("name");
	if(name1==''){
		alert('Invalid user detected. You will now be redirected to the home page');
		window.location.replace("/");
	}
	else{
		var type1 = 'userhub';
		var jsonSend = {name: name1,type: type1};
		ws.send(JSON.stringify(jsonSend));
	}
};
};

ws.onmessage = function(message){
	var object = JSON.parse(message.data);
	var k=document.createTextNode(object.kills);
	var kills = document.getElementById('kills');
	kills.appendChild(k);
	k=document.createTextNode(object.deaths);
	kills = document.getElementById('deaths');
	kills.appendChild(k);
	k=document.createTextNode((object.kills/object.deaths));
	kills = document.getElementById('kd');
	kills.appendChild(k);
	k=document.createTextNode(object.name);
	kills = document.getElementById('name');
	kills.appendChild(k);
	k=document.createTextNode(object.enemyKills);
	kills = document.getElementById('ekills');
	kills.appendChild(k);
	k=document.createTextNode(object.enemyDeaths);
	kills = document.getElementById('edeaths');
	kills.appendChild(k);
	k=document.createTextNode((object.enemyKills/object.enemyDeaths));
	kills = document.getElementById('ekd');
	kills.appendChild(k);

};

function getCookie(cname)
{
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) 
    {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}//shamelessly ripped from w3schools <3
