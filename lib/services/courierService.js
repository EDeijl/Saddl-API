'use strict';
var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Courier = mongoose.model('Courier'),
    config = require('../config/config'),
    Transport = mongoose.model('Transport'),
    https = require('https'),
    ObjectId = mongoose.Types.ObjectId,
    TransportType = mongoose.model('TransportType');




exports.assignCourier = function(order, callback)
{
  Courier.find({}).populate('_specialties _transportation').exec(function (err, couriers) 
  {
    if (!err)
    {
      //uitlezen json van order die binnenkomt
      var specialtyVereist = 'ICT';
      var fastestTime = '';
      var fastestCourier;
      couriers.forEach(function(item, index) //voor elke bezorger!!
		  {
        //json gebruiker uitlezen voor check
        var statusbezorger = item.status;
        var z = item._specialties.length;
        for(var i=0;i<z;i++)
        {
          var huidigecourier = item._id;
          if(item.status === statusbezorger && item._specialties[i].name === specialtyVereist) //&& item.specialties === specialty en capacity)
          {
            //console.log(item.name);
            var origins = order.origin;
            var destinations = order.destination;
            var mode = 'driver';
            var sensor = 'false'; //gebruiker voor gps locatie bepalen op true ?
            var options  = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&mode='+mode+'&sensor='+sensor+'&key='+config.google_key;
            var time = sendRequest(options, huidigecourier);
            if(time < fastestTime || fastestTime === '')
            {
              fastestTime = time;
              fastestCourier = huidigecourier;
            }
          }
        }
      });
      console.log('fastestCourier: ' + fastestCourier);
      order._courier = ObjectId(fastestCourier.toString());
      order.time = fastestTime;
      console.log(order);
      return callback(order);
    }
  });
};
var sendRequest =function(options, huidigeCourier){
  https.request(options , function(res)
  {
    var huidigecourier = huidigeCourier;
    var nameclosest = '';
    var timeclosest = '';
    res.on('data', function(myJSONResult)
    {
      process.stdout.write(myJSONResult);           //alles json printen
      var info = JSON.parse(myJSONResult);          //parse resultaat in object
      var destinationaddress = info.destination_addresses;
      var timejson = info.rows[0].elements[0].duration.text;
      //console.log(timejson); 25min
      var timestring = String(timejson);
      return  timestring.replace(/[A-Za-z$-]/g, "");
    });
  });
};
