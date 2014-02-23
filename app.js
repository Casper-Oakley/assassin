
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , hbs = require('hbs')
  , async = require('async');

// npm install mongodb
var mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient;
   

var mongoose = require('mongoose');

//var MONGOHQ_URL="mongodb://user:password@ds027709.mongolab.com:27709/heroku_app22444850"
var MONGOHQ_URL="mongodb://user:pass@ds027729.mongolab.com:27729/heroku_app22444850"
//mongoose.connect('mongodb://localhost/test');

var WebSocketServer = require('ws').Server

	console.log("wow");
	mongoose.connect(MONGOHQ_URL);
	var user = mongoose.Schema({
		name: String,
		pass: String,
		number: String,
		ID: Number,
		enemyID: Number,
		isPicked: Boolean,
		isDead: Boolean,
		url: String,
		score: Number,
		totalScore: Number,
		totalDeath: Number
	});
	var user1 = mongoose.model('user1',user);
	var testUser1 = new user1({ name: 'Casper Oakley',pass: 'pass1', ID: 1,isPicked: true, isDead: false, number: '07884036188', enemyID: 2,url: './images/1.jpg',score: 0,totalScore: 0});
	var testUser2 = new user1({ name: 'Sam Berkay',pass: 'pass2', ID: 2,isPicked: true, isDead: false, number: '07972032036', enemyID: 3, url: './images/2.jpg',score: 0,totalScore: 0,totalDeath: 0});
	var testUser3 = new user1({ name: 'Chris Birm',pass: 'pass3', ID: 3,isPicked: true, isDead: false, number: '+447810494417', enemyID: 4, url: './images/3.jpg',score: 0,totalScore: 0,totalDeath: 0});
	var testUser4 = new user1({ name: 'Connor Pettitt',pass: 'pass4', ID: 4,isPicked: true, isDead: false, number: '07580501012', enemyID: 5,url: './images/4.jpg',score: 0,totalScore: 0,totalDeath: 0});
	var testUser5 = new user1({ name: 'Luke Geeson',pass: 'pass5', ID: 5,isPicked: true, isDead: false, number: '07597576473', enemyID: 6,url: './images/5.jpg',score: 0,totalScore: 0,totalDeath: 0});
	var testUser6 = new user1({ name: 'Hack Bradbook',pass: 'pass6', ID: 6,isPicked: true, isDead: false, number: '0771651426', enemyID: 1,url: './images/6.jpg',score: 0,totalScore: 0,totalDeath: 0});
	//testUser1.save();
	//testUser2.save();
	//testUser3.save();
	//testUser4.save();
	//testUser5.save();
	//testUser6.save();

var twilio = require('twilio');

var client = new twilio.RestClient('ACd33440265fbfd13384a294c4aca2f63b','0495474119a09a662a5e6744d276aa89');

var sys = require('sys');


var app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));
app.set('view engine','html');
app.engine('html',hbs.__express);
app.use(express.bodyParser());

app.get('/', function(req,res){
  res.render('index',{title:"stabman"});
});

app.get('/signup', function(req,res){
  res.render('signup',{title:"signup"});
});

app.get('/leaderboard', function(req,res){
	res.render('leaderboard',{title:"LeaderBoard"})
});

app.get('/userhub', function(req,res){
	res.render('userhub',{title:"User Profile"})
});

app.post('/incoming', function(req, res) {
  var message = req.body.Body;
  var from = req.body.From;
  from = from.replace(/^\+44/,0);
  sys.log('From: ' + from + ', Message: ' + message);
  var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Sms>text recieved</Sms>n</Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
  if(message=='confirm'){
			 user1.findOne({'number':from},'enemyID ID isDead',function(err,username2){
				 if(username2.isDead == false){
			 user1.findOne({'ID':username2.enemyID},'name ID enemyID',function(err,username3){
			 user1.findOne({'ID':username3.enemyID},'name ID enemyID',function(err,username){
				  message = 'Your next target is ' + username.name + '. You just killed ' + username3.name;
				  user1.remove({ID:username3.ID});
				  username3.isDead=true;
				  username3.save()
				  user1.remove({ID:username2.ID});
				  username2.enemyID=username.ID;
				  username2.score=username2.score+1;
				  username2.save()
          client.sms.messages.create({
	          to: from,
	          from:'+441482240221',
	          body: message
          }, function(error,message){
	          if(!error){
		          console.log('wahey message sent successfully.');
		          console.log('ID is ' + message.sid);
	          } else{
		          console.log('error: ' + error);
	          }
			 });
			 });
          });
		}
		else{
			console.log(from + " sent the message " + message);
		}
	  });
	console.log(from + " sent the message " + message);
  }
  else if(message=='who'){
	 user1.findOne({'number':from},'enemyID ID',function(err,username2){
		 user1.findOne({'ID':username2.enemyID},'name ID enemyID',function(err,username3){
			 message = username3.name;
          client.sms.messages.create({
	          to: from,
	          from:'+441482240221',
	          body: message
          }, function(error,message){
	          if(!error){
		          console.log('wahey message sent successfully.');
		          console.log('ID is ' + message.sid);
	          } else{
		          console.log('error: ' + error);
	          }
			 });

		 });
	 });
  }
  else if(message=='reset')
  {
	user1.findOne({'name':'Casper Oakley'},'number',function(err,username){
		if(username.number==from){
			var totalCount;
			user1.count({}, function( err, count){
				totalCount=count;
				});
			var count = 1;
			user1.find({}, function (err,docs){
				for(;count<=totalCount;count++){
				docs[count-1].remove();
				var tempUser = new user1({ name: docs[count-1].name,pass: docs[count-1].pass, ID: count,isPicked: true, isDead: false, number: docs[count-1].number, enemyID: count+1,url: docs[count-1].url,score: 0,totalScore: docs[count-1].totalScore,totalDeath:docs[count-1].totalDeath});
				tempUser.save();
				}
			});
			user1.count({}, function( err, count){
				user1.findOne({ID:count},'ID',function(err,username){
				  user1.remove({ID:username.ID});
				  username.enemyID=1;
				  username.save();
				});
			});
			user1.find({}, function (err,docs){
				var totalCount = 0;
				user1.count({}, function( err, count1){
				totalCount=count1;
				var count = 1;
				async.each(docs,function (item,err){
					var from = item.number;
					user1.findOne({ID:item.enemyID},'name',function(err,username){
						var target = username.name;
						console.log(from + " " + target);
				  client.sms.messages.create({
					  to: from,
					  from:'+441482240221',
					  body: 'Welcome to ass-soc. Your target is ' + target +'. Reply with confirm if you have killed your target. If you have forgotten who your target is, text who'
				  }, function(error,message){
					  if(!error){
						  console.log('wahey message sent successfully.');
						  console.log('ID is ' + message.sid);
					  } else{
						  console.log('error: ' + error);
					  }
					 });
					});
				});
			});
		});
		}
	});
  }
});
var server = http.createServer(app);
server.listen(app.get('port'), function(){
	var resp = new twilio.TwimlResponse();
	console.log(resp.toString());
  console.log("Express server listening on port " + app.get('port'));
});

var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws){
	ws.on('message',function(message){
		var response = JSON.parse(message);
				var tempUser = new user1({ name: response.name,pass: response.pass, ID: 0,isPicked: true, isDead: true, number: response.number, enemyID: 0,url: ' ',score: 0,totalScore: 0,totalDeath: 0});
				tempUser.save();
				console.log('new user added. name: ' + response.name);
	});
});
