var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var mongoose = require('mongoose');


var DriverSchema = mongoose.Schema({
  Type: String,
  NrmRt: String,
  PekRt:String,
  StPekTm: String,
  EnPekTm: String,
  Status : String


});

var Tariff = mongoose.model('Tariff', DriverSchema, 'Tariff');


router.get('/getTrf', function(req, res){
  console.log("Reached Tariff Get Function on Server");
  Tariff.find({}, function(err, docs){
    res.json(docs);
  });
});

router.get('/getTrf/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER");
    Tariff.find({ Type: req.params.id }, function(err, docs) {
        res.json({docs});

    });
});

router.post('/addTrf', function(req, res){
  console.log(req.body);




  var tariff = new Tariff ({
    Type: req.body.Type,
    NrmRt: req.body.NrmRt,
    PekRt: req.body.PekRt,
    StPekTm: req.body.StPekTm,
    EnPekTm: req.body.EnPekTm,
    Status: req.body.Status

  });
  console.log(tariff);
  tariff.save(function(err, docs){
    if(err) throw err;
    console.log("Tariff Details Saved");
    res.json(docs);
  });

})

router.delete('/deleteTrf/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    Tariff.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})


module.exports = router;
