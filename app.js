var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var flash=require('connect-flash');
var mongoose=require('mongoose'),
   Schema=mongoose.Schema,
   ObjectId=Schema.ObjectId;

var app = express();

app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.bodyParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/users');

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  req.flash('info', 'Hello,Here we are doing the CRUD Application with MongoDB');
  res.render('home', { message: req.flash('info') });
});

app.get('/users',user.read);
app.get('/student',user.student);

app.get('/users/:id',user.show);

app.post('/users', user.insert);

app.delete('/users/:id',user.destroy);

app.put('/users/:id',user.update);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});