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
		var nameAcc=document.createTextNode(name1);
		var accBox=document.getElementById('nameAccount');
		accBox.appendChild(nameAcc);
		var type1 = 'leaderboard';
		var jsonSend = {name: name1,type: type1};
		ws.send(JSON.stringify(jsonSend));
	}
};
};

ws.onmessage = function(message){
	var object = JSON.parse(message.data);
	var i=0;
	object=object.sort(mycomparator);
	for(;i<object.length;i++){
		var tab = document.getElementById("table");
		var tr = document.createElement("TR");
		var td1 = document.createElement("TD");
		var td2 = document.createElement("TD");
		var nm=document.createTextNode(object[i].name);
		var kll = document.createTextNode(object[i].totalScore);
		td1.appendChild(nm);
		td2.appendChild(kll);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tab.appendChild(tr);
	}
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

function mycomparator(a,b) {
	  return parseInt(b.totalScore) - parseInt(a.totalScore);
}//shamelessly ripped from stackoverflow (wow such skill)
