
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

app.post('/incoming', function(req, res) {
  var message = req.body.Body;
  var from = req.body.From;
  sys.log('From: ' + from + ', Message: ' + message);
  var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Sms>Thanks for your text, well be in touch.</Sms>n</Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
  client.sms.messages.create({
	  //to:'+447884036188',
	  to: from,
	  from:'+441482240221',
	  //body:'Test'
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



var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
});

var user = mongoose.Schema({
	name: String,
	ID: Number,
	isPicked: Boolean
});

var user1 = mongoose.model('account',user);

var testUser1 = new user1({ name: 'Casper Oakley', ID: 1,isPicked: false});
var testUser2 = new user1({ name: 'Sam Berkay', ID: 2,isPicked: false});

console.log(testUser1.name);
console.log(testUser2.name);


http.createServer(app).listen(app.get('port'), function(){
	var resp = new twilio.TwimlResponse();
	console.log(resp.toString());
  console.log("Express server listening on port " + app.get('port'));
});
