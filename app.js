
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , hbs = require('hbs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

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

app.get('/leaderboard', function(req,res){
	res.render('leaderboard',{title:"LeaderBoard"})
});

app.get('/userhub', function(req,res){
	res.render('userhub',{title:"User Profile"})
});

var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
});

var user = mongoose.Schema({
	name: String,
	pass: String,
	number: String,
	ID: Number,
	enemyID: Number,
	isPicked: Boolean,
	isDead: Boolean,
	url: String
});

var user1 = mongoose.model('user1',user);

var testUser1 = new user1({ name: 'Casper Oakley',pass: 'pass1', ID: 1,isPicked: true, isDead: false, number: '07884036188', enemyID: 2,url: './images/1.jpg'});
var testUser2 = new user1({ name: 'Sam Berkay',pass: 'pass2', ID: 2,isPicked: true, isDead: false, number: '1234', enemyID: 3, url: './images/2.jpg'});
var testUser3 = new user1({ name: 'Chris Birm',pass: 'pass3', ID: 3,isPicked: true, isDead: false, number: '2345', enemyID: 4, url: './images/3.jpg'});
var testUser4 = new user1({ name: 'Connor Pettitt',pass: 'pass4', ID: 4,isPicked: true, isDead: false, number: '2445', enemyID: 5,url: './images/4.jpg'});
var testUser5 = new user1({ name: 'Luke Geeson',pass: 'pass5', ID: 5,isPicked: true, isDead: false, number: '2545', enemyID: 6,url: './images/5.jpg'});
var testUser6 = new user1({ name: 'Hack Bradbook',pass: 'pass6', ID: 6,isPicked: true, isDead: false, number: '2645', enemyID: 1,url: './images/6.jpg'});


//testUser1.save()
//testUser2.save()
//testUser3.save()
//testUser4.save()
//testUser5.save()
//testUser6.save()

app.post('/incoming', function(req, res) {
  var message = req.body.Body;
  var from = req.body.From;
  sys.log('From: ' + from + ', Message: ' + message);
  var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Sms>text recieved</Sms>n</Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
  if(message=='confirmed'){
			 user1.findOne({'number':from},'enemyID ID',function(err,username2){
			 user1.findOne({'ID':username2.enemyID},'name ID enemyID',function(err,username3){
			 user1.findOne({'ID':username3.enemyID},'name ID enemyID',function(err,username){
				  message = 'Your next target is ' + username.name + '. You just killed ' + username3.name;
				  user1.remove({ID:username3.ID});
				  username3.isDead=true;
				  username3.save()
				  user1.remove({ID:username2.ID});
				  username2.enemyID=username.ID;
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
	  });
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
	user1.findOne({'ID':1},'number',function(err,username){
		if(username.number==from){
			var totalCount;
			user1.count({}, function( err, count){
				totalCount=count;
				});
			var count = 1;
			user1.find({}, function (err,docs){
				for(;count<=totalCount;count++){
				docs[count-1].remove();
				var tempUser = new user1({ name: docs[count-1].name,pass: docs[count-1].pass, ID: count,isPicked: true, isDead: false, number: docs[count-1].number, enemyID: count+1,url: docs[count-1].url});
				tempUser.save();
				}
			});
			user1.count({}, function( err, count){
				user1.findOne({ID:count},'ID',function(err,username){
				  user1.remove({ID:username.ID});
				  username.enemyID=1;
				  username.save()
				});
			})
		}
	});
  }
});

http.createServer(app).listen(app.get('port'), function(){
	var resp = new twilio.TwimlResponse();
	console.log(resp.toString());
  console.log("Express server listening on port " + app.get('port'));
});
