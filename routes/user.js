var express = require('express');
var flash=require('connect-flash');
var app = express();

app.configure(function() {
  app.use(express.cookieParser('keyboard cat'));
  app.use(express.session({ cookie: { maxAge: 60000 }}));
  app.use(flash());
});

var mongoose=require('mongoose'),
  validate = require('mongoose-validator').validate,
  Schema=mongoose.Schema,
  ObjectId=Schema.ObjectId;

var StudentSchema=new Schema({
  studentsRoll:ObjectId,
  name: {
    first: {type: String, required: true }, 
    last: {type: String, required: true }
  },
  age:{ type: Number, required: true},
  contact:{ type: Number, required: true },
  email:{ type: String, unique: true, required: true },
  course:{ type: String, required: true },
  fee:{ type: Number, required: true },
  doa:{ type: Date, required: true }
});


StudentSchema.virtual('name.full')
.get(function () {
  return this.name.first + ' ' + this.name.last;
});

StudentSchema.path('name.first').validate(function (val) {
  if (val.length >= 3){
    return true;
  }
  return false;
}, 'First name should be between 5 and 50 characters');

StudentSchema.path('age').validate(function (val) {
  if (val >= 16 && val <= 70 ){
    return true;
  }
  return false;
}, 'Age Should be more than 16');

StudentSchema.path('doa').validate(function (val) {
  var doa = val;
  var today = new Date();
  if (doa<today)
  {
    return true; 
  }
  return false;         
}, 'date should be earlier than today date');

StudentSchema.path('email').validate(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
  , 'Email Id should be in proper format');


var Students=mongoose.model('Students',StudentSchema);

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.read = function(req, res){
  Students.find({},function(err,docs){
    if (err){
      throw err;
    } else{
      res.json(docs);
    };
  });
};
exports.student = function(req,res){
  res.redirect('student.html');
}

exports.show = function(req, res){
  Students.findById(req.params.id, function (err,student){
    if (err){
      throw err;
    } else{
      res.send(student);
    };
  });
};

exports.insert = function(req, res){
  var stud = new Students({
    name: { first: req.body.sfname , last:req.body.slname},
    age:req.body.age,
    contact:req.body.phone,
    email:req.body.email,
    course:req.body.course,
    fee:req.body.fee,
    doa:req.body.doa
  });

  stud.save(function (err,docs){
    if(err){
      Object.keys(err.errors).forEach(function(key) {
        var message = err.errors[key].message;
        console.log('Validation error for "%s": %s', key, message);
      });
    }
    res.json(docs);
  });
};

exports.destroy= function(req, res){
  Students.remove({_id:req.params.id},function(err,docs){
    if (err){
      throw err;
    };
    res.json(docs);
  });
};



exports.update= function(req, res){
  Students.findByIdAndUpdate(req.params.id,
  {
    name: {first:req.body.sfname,last:req.body.slname},
    age:req.body.age,
    contact:req.body.phone,
    email:req.body.email,
    course:req.body.course,
    fee:req.body.fee,
    doa:req.body.doa
  },
  function(err,docs){
    if(err){
      Object.keys(err.errors).forEach(function(key) {
        var message = err.errors[key].message;
        console.log('Validation error for "%s": %s', key, message);
      });
    }
    res.json(docs);
  });
};
