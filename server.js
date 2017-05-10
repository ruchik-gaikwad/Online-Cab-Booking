var logger = require('morgan');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var multer = require('multer');
var server  = require('http').Server(app);
var io =  require('socket.io').listen(server);



var DriverCrud = require('./routes/driver-CRUD');
var Tariff = require('./routes/Tariff');
var AssignCrud = require('./routes/assign-CRUD');
var UploadFile = require('./routes/upload.js');
var Users = require('./routes/Users.js');
var Booking = require('./routes/bookcab.js');



app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/build'));
app.use(express.static(__dirname + '/uploads'));

app.use(bodyParser.json());
app.use('/cabr/', DriverCrud);
app.use('/tarif/', Tariff);
app.use('/asmv/', AssignCrud);
app.use('/upld/', UploadFile);
app.use('/user/', Users);
app.use('/bookcab/', Booking);


var mongo = require('mongodb');
var mongoose = require('mongoose');
var dbHost = 'mongodb://localhost:27017/cabReg';
mongoose.connect(dbHost);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log("Entered into DB");
});
var DriverList = {};

var Driver = mongoose.model('Driver');
var driversocketid;

io.on('connection', function(socket) {
    console.log('Socket Connected');
    console.log(socket.id);
    var driversocketid  = socket.id;
    socket.on('init', function(data) {
        Driver.findOne({cabrdriverPhoneno : data.driver.mobile},
        function(err, Driver){
          if(err){
            res.json(err);
          }else {
            console.log(socket.id);
            DriverList[socket.id]  = {
              location: data.location,
              id: socket.id,
              cabdata: Driver,
              driverdata: data
            };
            console.log('Driver Added');
            console.log(DriverList[socket.id]);
            socket.broadcast.emit('NewDriver', DriverList[socket.id]);
          }
        });

        });

        socket.on('BookRide', function(data){
          var DriverLat,  DriverLng, Length, Key, id;
          var near = 1;
          var CustLat = data.location.lat;
          var CustLng = data.location.lng;
          var SelectedCab =  data.SelectedCab;
          var PickLocation =  data.Pickup;
          var DestLocation =  data.Dest;
          var Fare = data.Fare;
          Length = Object.keys(DriverList).length;
          Key = Object.keys(DriverList);
          var CabTypeDriversData = {};
          var DriverData, CabData;
          console.log(CustLat + "  " +  SelectedCab+ "  "+ Fare+ ' ' +  CustLng + ' '+ PickLocation+ ' '+ DestLocation);

          for(cab in DriverList){
            if (SelectedCab == DriverList[cab].cabdata.cabrType){
              console.log('Matched Cab Found');
              CabTypeDriversData[cab] = {
                latitude: DriverList[cab].location.lat,
                longitude: DriverList[cab].location.lng,
                driverInfo: DriverList[cab].driverdata.driver,
                cabInfo: DriverList[cab].cabdata,
                id: DriverList[cab].id
              };
              console.log(CabTypeDriversData);
            }else {
              console.log('No SelectedCab found');
              socket.emit('BookingDetails', {
                Status: false
              });
            }
          }
            Length = Object.keys(CabTypeDriversData).length;
            Key = Object.keys(CabTypeDriversData);
            if(Length == 0){
              id = 0;
            }else {
                  for(cab in CabTypeDriversData){
                    DriverLat = CabTypeDriversData[cab].latitude;
                    DriverLng = CabTypeDriversData[cab].longitude;
                    diff = closestCab(CustLat, CustLng, DriverLat, DriverLng);
                    console.log(diff);
                    if(diff< near) {
                      near = diff;
                      id = cab;
                      DriverData = CabTypeDriversData[cab].driverInfo;
                      CabData = CabTypeDriversData[cab].cabInfo;
                    }
                  }
            }
            if (id == 0) {
              socket.emit('BookingDetails', {
                Status: false
              });
            }else {
              socket.emit('BookingDetails', {
                DriverDetails : DriverData,
                CabDetails: CabData,
                BookingId: id,
                CabFare: Fare,
                Status: true
              });
              console.log('Sending Confirmation to driver');
              console.log(id);
              io.to(id).emit('DriverAcknowledge', {
                Customer: data.CustomerInfo,
                Pickup: data.Pickup,
                Drop: data.Dest,
                BookingId: id,
                CabFare: Fare,
                Status: 'Booked'
              });
              console.log('Acknowledeged')
            }
        });
        function closestCab(custLat, custLong, driverLat, driverLong){
            var pos = 0.017453292519943295;
            var calc = Math.cos;
            var adjust = 0.5 - calc((driverLat - custLat)* pos)/2 + calc(custLat* pos)*calc(driverLat* pos)* (1 - calc((driverLong - custLong)*pos))/2;
            return 12742 * Math.asin(Math.sqrt(adjust));
        }
    });




(function(){

   var webpack = require('webpack');
   var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config' );
   var compiler = webpack(webpackConfig);


   app.use(require("webpack-dev-middleware")(compiler, {
     publicPath: webpackConfig.output.publicPath,
     headers: {"X-custom-Webpack-Header" : "yes"},
     stats:{
       colors: true
     }

}));

app.use(require("webpack-hot-middleware")(compiler,{
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

})();


 server.listen(8080, function (req, res) {
  console.log('this is the stop:8080')
});
