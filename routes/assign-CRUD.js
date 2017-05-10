var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var mongoose = require('mongoose');


var DriverSchema = mongoose.Schema({
  asmvDvrNm: String,
  asmvDvrPhno: String,
  asmvCarTyp:String,
  asmvCarNm:String


});

var AssignCar = mongoose.model('AssignCar', DriverSchema, 'assigncar');


router.get('/getAsmv', function(req, res){
  console.log("Reached AssignCar Get Function on Server");
  AssignCar.find({}, function(err, docs){
    res.json(docs);
  });
});

router.get('/getAsmv/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER");
    AssignCar.find({ _id: req.params.id }, function(err, docs) {
        res.json(docs);

    });
});

router.post('/addAsmv', function(req, res){
  console.log(req.body);

  var dName = req.body.asmvDvrNm;
  var dPhno = req.body.asmvDvrPhno;
  var cTyp = req.body.asmvCarTyp;
  var cModl = req.body.asmvCarNm;


  var assign = new AssignCar ({
    asmvDvrNm: dName,
    asmvDvrPhno: dPhno,
    asmvCarTyp: cTyp,
    asmvCarNm: cModl


  });
  console.log(assign);
  assign.save(function(err, docs){
    if(err) throw err;
    console.log("Driver Details Saved");
    res.json(docs);
  });

})

router.delete('/deleteAsmv/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    AssignCar.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})


module.exports = router;
