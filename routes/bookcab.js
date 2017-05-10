var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');

var BookingSchema = mongoose.Schema({
  BookingId: String,
  PickupLocation: String,
  DestinationLocation: String,
  BookingType: String,
  PickupDate: String,
  PickupTime: String,
  Fare: Number,
  Customer: Object,
  Driver: Object,
  Cab: Object,
  CabType: String,
  Distance: String,
  BookingStatus: String
});

var Booking = mongoose.model('Booking', BookingSchema, 'Booking');

router.get('/getbooking', function(req, res){
  console.log("Reached Booking Get Function on Server");
  Booking.find({}, function(err, docs){
    res.json(docs);
  });
});

router.get('/getcust/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER for Customer booking");
    Booking.find({"Customer.Email" : req.params.id }, function(err, docs) {
        res.json({docs});

    });
});

router.get('/getdriver/:id', function(req, res) {
    console.log("REACHED GET ID FUNCTION ON SERVER for booking");
    Booking.find({"Driver.Email" : req.params.id }, function(err, docs) {
        res.json({docs});

    });
});

router.post('/bookcabnow', function(req, res){
  console.log(req.body);




  var booking = new Booking ({
    BookingId: req.body.BookingId,
    PickupLocation: req.body.PickupLocation,
    DestinationLocation: req.body.DestinationLocation,
    BookingType: req.body.BookingType,
    PickupDate: req.body.PickupDate,
    PickupTime: req.body.PickupTime,
    Fare: req.body.Fare,
    Customer: req.body.Customer,
    Driver: req.body.Driver,
    Cab: req.body.Cab,
    CabType: req.body.CabType,
    Distance: req.body.Distance,
    BookingStatus: req.body.BookingStatus

  });
  console.log(booking);
  booking.save(function(err, docs){
    if(err) throw err;
    console.log("New Booking Details Saved");
    res.json(docs);
  });

})

router.delete('/deletebooking/:id', function(req, res) {
    console.log("REACHED Delete FUNCTION ON SERVER");
    Booking.remove({ _id: req.params.id }, function(err, docs) {
        res.json(docs);
    });
})

module.exports = router;
