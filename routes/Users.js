var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');


var mongoose = require('mongoose');


var UsersSchema = mongoose.Schema({

  UserType : String,
  Password : String,
  MobileNumber : String,
  Email : String,
  LastName : String,
  FirstName : String

});

UsersSchema.methods.generateHash = function(Password) {
  return bcrypt.hashSync(Password, bcrypt.genSaltSync(9), null);

}

UsersSchema.methods.validPassword = function(Password) {
  return bcrypt.compareSync(Password, this.Password);

}

var Users = mongoose.model('Users', UsersSchema, 'Users');

// var admin = new Users({UserType:'Admin', Password:'admin@123', MobileNumber:'9013852280', Email:'admin@gmail.com', LastName:'Admin', FirstName:'Admin' });
// admin.Password = admin.generateHash('Password');
// admin.save();

router.get('/getUser', function(req, res){
  console.log("Reached Driver Get Function on Server");
  Users.find({}, function(err, docs){
    res.json(docs);
  });
});


router.post('/addUsers', function(req, res){


  var user = new Users ();

    user.UserType = req.body.UserType;
    user.Password =  user.generateHash(req.body.Password);
    user.MobileNumber = req.body.MobileNumber;
    user.Email  = req.body.Email;
    user.LastName  = req.body.LastName;
    user.FirstName  = req.body.FirstName;




// user.Password = user.generateHash('Password');

  console.log(user);
  user.save(function(err, docs){
    if(err) throw err;
    console.log("Driver Details Saved");
    res.json(docs);
  });

})

router.get('/getUser/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER");
  Users.find({ Email: req.params.id }, function(err, docs) {
        res.json({docs});

    });
});

router.put('/updatePass/:id', function(req, res) {
  Users.findOneAndUpdate({Email: req.params.id})
})

router.delete('/deleteUser/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    Users.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})

router.post('/register', function(req, res){
  console.log('at register Customer api');
  Users.findOne({
    Email:req.body.Email}, function(err, user){
      if (user) {
        res.json({ success : false,
          message: 'You are already a user .!!'
        });
      }else {
        var user =  new Users();
        user.UserType = req.body.UserType;
        user.FirstName = req.body.FirstName;
        user.LastName =  req.body.LastName;
        user.MobileNumber = req.body.MobileNumber;
        user.Email = req.body.Email;
        user.Password = user.generateHash(req.body.Password);
        user.save(function(err, docs){
          if (err) throw  err;
        });
        console.log(user);
        res.json({success : true , message : 'User Registered'});
      }
    });

    console.log('new customer saved');

});

router.post('/login', function(req, res) {
Users.findOne({Email : req.body.Email},
function(err, user){
  if(err){
    res.json(err);
  }else if (!user) {
    res.json({
      success : false,
      message: 'wrong email id'
    });
    console.log('wrong Email');

  }else if (!user.validPassword(req.body.Password)) {
    res.json({
      success : false,
      message : 'Wrong password'
    });
    console.log('wrong passcode');
  }else if (user) {
    var token = jwt.sign(user, 'itisthebloodyscreet',{
      expiresIn : 9879
    });
    res.json({
      success : true,
      token : token,
      isLoggedIn : true,
      userDetail : user
    });
    console.log(token);
    console.log('token Created');
  }
});
});

module.exports = router;
