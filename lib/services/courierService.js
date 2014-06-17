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

var sendRequest = function(options, huidigeCourier, callback)
{
    var req = https.request(options , function(res)
    {
        var huidigecourier = huidigeCourier;
        var nameclosest = '';
        var timeclosest = '';
        res.on('data', function(myJSONResult)
        {
            //process.stdout.write(myJSONResult);           //alles json printen
            var info = JSON.parse(myJSONResult);          //parse resultaat in object
            //var destinationaddress = info.destination_addresses;
            var timejson = info.rows[0].elements[0].duration.text;
            //console.log(timejson); 25min
            var timestring = String(timejson);
          
            callback(timestring.replace(/[A-Za-z$-]/g, ""));
        });
    }).end();  
};

exports.assignCourier = function(order, callback)
{
    //console.log(order);
    Courier.find({}).populate('_specialties _transportation _orders.packages').exec(function (err, couriers) 
    {
        if (!err)
        {
            //uitlezen json van order die binnenkomt
            if(order.specialty !== undefined) //Als de order een specialty heeft/vereist die dan lezen en invullen
            {
                var specialtyVereist = order.specialty.name;
            }
      
            var fastestname ='';
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
                var gewicht = totaalgewichtalleorders;
                if(order._packages.weight !== undefined)
                {
                    gewicht = totaalgewichtalleorders + order._packages.weight;
                }
                //console.log(item.location.latitude);
                //console.log(item.location.longitude);
                var origins = item.location.latitude+","+item.location.longitude;
                var destinations = order.origin;
                //console.log(destinations);
                var mode = 'driver';
                var sensor = 'false'; //gebruiker voor gps locatie bepalen op true ?
                var options  = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&mode='+mode+'&sensor='+sensor+'&key='+config.google_key;
                
                //console.log("nu request sturen!");
                sendRequest(options, huidigecourier, function(time)
                {
                    //console.log(item.name);
                    //console.log(time);
                        
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
                                    fastestname = item.name;
                                    //console.log(item.name+" is sneller!");
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
                                    fastestname = item.name;
                                }
                            }
                        }
                    }
                    console.log('Id van fastestCourier: ' + fastestCourier);
                    console.log(fastestname);
                    order._courier = new ObjectId(fastestCourier.toString());
                    order.time = fastestTime;
                    return callback(order);
                });  
            });      
        }
    });
};
