'use strict';
var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Courier = mongoose.model('Courier'),
    courierOrder = mongoose.model('courierOrder'),
    config = require('../config/config'),
    Transport = mongoose.model('Transport'),
    https = require('https'),
    ObjectId = mongoose.Types.ObjectId,
    TransportType = mongoose.model('TransportType');


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

exports.assignCourier = function(order, callback)
{
    console.log(order);
    Courier.find({}).populate('_specialties _transportation _orders.packages').exec(function (err, couriers) 
    {
        if (!err)
        {
            //uitlezen json van order die binnenkomt
            if(order.specialty !== undefined) //Als de order een specialty heeft/vereist die dan lezen en invullen
            {
                var specialtyVereist = order.specialty.name;
            }
      
            var fastestTime = '';
            var fastestCourier; 
      
            couriers.forEach(function(item, index) //voor elke bezorger!!
            {
                //json gebruiker uitlezen voor check
                var statusbezorger = item.status;
                var z = item._specialties.length;
        
                var totaalgewichtalleorders = 0.0;
                courierOrder.find({}).populate('_courier _order._packages').exec(function (err, courierOrders) 
                {
                    courierOrders.forEach(function(entry, index)
                    {
                        if(item._id === entry._courier)
                        {
                            if(entry._order._packages.weight !== undefined)
                            {
                                totaalgewichtalleorders = totaalgewichtalleorders + entry._order._packages.weight;
                            }
                        }
                    });
                });
        
                var huidigecourier = item._id;
                console.log(huidigecourier);
                var gewicht = totaalgewichtalleorders;
                if(order._packages.weight !== undefined)
                {
                    gewicht = totaalgewichtalleorders + order._packages.weight;
                }
                var origins = order.origin;
                var destinations = order.destination;
                var mode = 'driver';
                var sensor = 'false'; //gebruiker voor gps locatie bepalen op true ?
                var options  = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&mode='+mode+'&sensor='+sensor+'&key='+config.google_key;
                var time = sendRequest(options, huidigecourier);
                    
                console.log(gewicht +" Het gewicht die deze courier al heeft!");
                for(var i=0;i<z;i++) //Voor elke specialty check of die overeenkomt!
                {
                    if(specialtyVereist !== null) //Order heeft geen specialty
                    {
                        if(item.status === statusbezorger && gewicht < item._transportation.maxWeight) //&& item.specialties === specialty en capacity)
                        { 
                            if(time < fastestTime || fastestTime === '')
                            {
                                fastestTime = time;
                                fastestCourier = huidigecourier;
                            }
                        }
                        break;
                    }
                    else //De order heeft een specialty!
                    {
                        //check of alles overeenkomt
                        if(item.status === statusbezorger && item._specialties[i].name === specialtyVereist && gewicht < item._transportation.maxWeight) //&& item.specialties === specialty en capacity) 
                        {
                            if(time < fastestTime || fastestTime === '')
                            {
                                fastestTime = time;
                                fastestCourier = huidigecourier;
                            }
                        }
                    }
                }
            });
            console.log('fastestCourier: ' + fastestCourier);
            order._courier = new ObjectId(fastestCourier.toString());
            order.time = fastestTime;
            return callback(order);
        }
    });
};