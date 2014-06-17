/**
 * THIS FILE HANDLES ALL COURIER ASSIGNMENTS, ENTER ON YOUR OWN BEHALVE
 * HERE BE DRAGONS
 * AND REALLY REALLY BAD CODE
 */
'use strict';
var mongoose = require('mongoose'),
    Order = mongoose.model('Order'),
    Courier = mongoose.model('Courier'),
    courierOrder = mongoose.model('courierOrder'),
    config = require('../config/config'),
    url = require('url'),
    Transport = mongoose.model('Transport'),
    request = require('request'),
    ObjectId = mongoose.Types.ObjectId,
    EsriService = require('./ESRIservice'),
    TransportType = mongoose.model('TransportType');

var fastestname ='';
var fastestTime = '';
var fastestCourier;
var specialtyVereist;
var statusbezorger;
var gewicht;
var huidigecourier;

var sendRequest = function(stops, courier, order, callback, callback2)
{
  EsriService.getToken(function(token){
    var esrilink = 'http://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve?token='+token+'&stops='+stops+'&f=json';
    var options = {
      url : esrilink,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    request(options, function(error, response, body){
      if(error) console.log('error', error);
      else{
        var json = JSON.parse(body);
        var time = json.directions[0].summary.totalTime;
        callback(time, courier, order, callback2);
      }

    })
  });
};


exports.assignCourier = function(order, callback)
{
  Courier.find({}).populate('_specialties _transportation _orders.packages').exec(function (err, couriers)
  {
    if (!err)
    {
      //uitlezen json van order die binnenkomt
      if(order.specialty !== undefined) //Als de order een specialty heeft/vereist die dan lezen en invullen
      {
        specialtyVereist = order.specialty.name;
      }


      couriers.forEach(function(item, index) //voor elke bezorger!!
      {
        //json gebruiker uitlezen voor check
        statusbezorger = item.status;
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

        huidigecourier = item._id;
        gewicht = totaalgewichtalleorders;
        if(order._packages !== undefined){
          if(order._packages.weight !== undefined)
          {
            gewicht = totaalgewichtalleorders + order._packages.weight;
          }
        }
        var origins = item.location.longitude+","+item.location.latitude;
        var destinations = order.destination;
        request('http://maps.googleapis.com/maps/api/geocode/json?address='+destinations+'&sensor=false', function(error, response, body){
          if(error) console.log('error: ', error);
          else {
            var json = JSON.parse(body);
            var location = json.results[0].geometry.location;
            console.log('location: ', location);
            var stops = origins + ';' + location.lng +','+location.lat;
            console.log('stops: ', stops);
            sendRequest(stops, item, order, fastestCourier, callback);
          }
        });
      });
    }
  });
};

var fastestCourier = function(time, courier, order, callback){
  for(var i=0;i<courier._specialties.length;i++) //Voor elke specialty check of die overeenkomt!
  {
    if(specialtyVereist !== null) //Order heeft geen specialty
    {
      if(courier.status === statusbezorger && gewicht < courier._transportation.maxWeight) //&& item.specialties === specialty en capacity)
      {
        if(time < fastestTime || fastestTime === '')
        {
          fastestTime = time;
          fastestCourier = huidigecourier;
          fastestname = courier.name;
          console.log(courier.name+" is sneller!");
        }
      }
      break;
    }
    else //De order heeft een specialty!
    {
      //check of alles overeenkomt
      if(courier.status === statusbezorger && courier._specialties[i].name === specialtyVereist && gewicht < courier._transportation.maxWeight) //&& item.specialties === specialty en capacity)
      {
        if(time < fastestTime || fastestTime === '')
        {
          fastestTime = time;
          fastestCourier = huidigecourier;
          fastestname = courier.name;
        }
      }
    }
  }
  order._courier = new ObjectId(fastestCourier.toString());
  order.time = fastestTime;
  fastestname ='';
  fastestTime = '';
  fastestCourier;
  specialtyVereist
  statusbezorger;
  gewicht;
  huidigecourier;
  return callback(order);
};
