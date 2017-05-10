var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');


var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/images');
  },
  filename: function (req, file, cb) {

    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)){
      var err = new Error();
      err.code = "filetype";
      return cb(err);

    }else {
      cb(null, Date.now() + '_' + file.originalname);
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

module.exports = router;
