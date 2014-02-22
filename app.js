
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , input = require('./routes/inputMess')
  , http = require('http')
  , path = require('path');

var twilio = require('twilio');

var client = new twilio.RestClient('ACd33440265fbfd13384a294c4aca2f63b','0495474119a09a662a5e6744d276aa89');

/*client.sms.messages.create({
	to:'+447810494417',
	from:'+441482240221',
	body:'Test'
}, function(error,message){
	if(!error){
		console.log('wahey message sent successfully.');
		console.log('ID is ' + message.sid);
	} else{
		console.log('error: ' + error);
	}
});*/

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/input', input.inputMess);

app.post('/incoming', function(req, res) {
  var message = req.body.Body;
  var from = req.body.From;
  sys.log('From: ' + from + ', Message: ' + message);
  var twiml = '<?xml version="1.0" encoding="UTF-8" ?>n<Response>n<Sms>Thanks for your text, we'll be in touch.</Sms>n</Response>';
  res.send(twiml, {'Content-Type':'text/xml'}, 200);
});



http.createServer(app).listen(app.get('port'), function(){
	var resp = new twilio.TwimlResponse();
	console.log(resp.toString());
  console.log("Express server listening on port " + app.get('port'));
});
