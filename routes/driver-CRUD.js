var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var fs = require('fs');
var FileName = '';


var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/resourses/uploads/images');
  },
  filename: function (req, file, cb) {

    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      var err = new Error();
      err.code = "filetype";
      return cb(err);

    }else {
      cb(null, Date.now() + '_' + file.originalname);
      FileName = Date.now() + '_' + file.originalname;
    }


     }
});

var upload = multer({ storage: storage,
                      limits: {fileSize:10000000 }
                    }).single('myfile');



router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      if(err.code === 'LIMIT_FILE_SIZE'){
        res.json({ success: false, message: "File size is too large. max size is 10mb"});
      } else if (err.code === 'filetype'){
        res.json ({success : false , message: "File type is invalid. Must be .png"});
      }else {
        console.log(err);
        res.json({ success : false, message: "file was not able to be uploaded"});
      }

    }else {
      if (!req.file){
        res.json ({success: false, message: 'No file was selected'});
      }else{
        res.json({success : true , message: 'File was uploaded'});
      }
    }

    // Everything went fine
  });
});







var mongoose = require('mongoose');


var DriverSchema = mongoose.Schema({
  cabrdriverName: String,
  cabrdriverNameLast: String,
  cabrdriverAdd:String,
  cabrdriverPhoneno: Number,
  cabrdriverLicenseno: Number,
  cabrdriverEmail:String,
  cabrType:String,
  cabrMake:String,
  cabrModel:String,
  cabrRegno:String,
  cabrimg:String

});

var Driver = mongoose.model('Driver', DriverSchema, 'driver');


router.get('/getCabr', function(req, res){
  console.log("Reached Driver Get Function on Server");
  Driver.find({}, function(err, docs){
    res.json(docs);
  });
});

router.get('/getCabr/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER");
    Driver.find({ _id: req.params.id }, function(err, docs) {
        res.json(docs);

    });
});

router.post('/addCabr', function(req, res){
  console.log(req.body);

  // var dName = req.body.cabrdriverName;
  // var dLast = req.body.cabrdriverNameLast;
  var dAddress = req.body.cabrdriverAdd;
  var dPhone = req.body.cabrdriverPhoneno;
  var dLin = req.body.cabrdriverLicenseno;
  // var dEmail = req.body.cabrdriverEmail;
  var cType = req.body.cabrType;
  var cMake = req.body.cabrMake;
  var cModel = req.body.cabrModel;
  var cRegno = req.body.cabrRegno;
  // var dimg = req.body.cabrimg;

  var driver = new Driver ({
    // cabrdriverName: dName,
    // cabrdriverNameLast: dLast,
    cabrdriverAdd: dAddress,
    cabrdriverPhoneno: dPhone,
    cabrdriverLicenseno: dLin,
    // cabrdriverEmail: dEmail,
    cabrType: cType,
    cabrMake: cMake,
    cabrModel: cModel,
    cabrRegno:  cRegno,
    cabrimg : FileName

  });

  //  driver.cabrimg.data = fs.readFileSync(req.file)
  //  driver.cabrimg.contentType = 'image/png';

  console.log(driver);
  driver.save(function(err, docs){
    if(err) throw err;
    console.log("Driver Details Saved");
    res.json(docs);
  });

})

router.delete('/deleteCabr/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    Driver.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})


module.exports = router;
module.exports = mongoose.model('Driver', DriverSchema, 'driver');
