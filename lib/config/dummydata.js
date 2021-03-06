'use strict';

var mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Thing = mongoose.model('Thing'),
  Courier = mongoose.model('Courier'),
  //CourierStatus = mongoose.model('CourierStatus'),
  Order = mongoose.model('Order'),
  OrderStatus = mongoose.model('OrderStatus'),
  Package = mongoose.model('Package'),
  Route = mongoose.model('Route'),
  Specialty = mongoose.model('Specialty'),
  Transport = mongoose.model('Transport'),
  TransportType = mongoose.model('TransportType'),
  courierOrder = mongoose.model('courierOrder'),
  Message = mongoose.model('Message');

/**
 * Populate database with sample application data
 */

//Clear old things, then add things in
Thing.find({}).remove(function() {
  Thing.create({
    //name : 'HTML5 Boilerplate',
    name : 500,
    info : 'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.',
    awesomeness: 10
  }, {
    name : 'AngularJS',
    info : 'AngularJS is a toolset for building the framework most suited to your application development.',
    awesomeness: 10
  }, {
    name : 'Karma',
    info : 'Spectacular Test Runner for JavaScript.',
    awesomeness: 10
  }, {
    name : 'Express',
    info : 'Flexible and minimalist web application framework for node.js.',
    awesomeness: 10
  }, {
    name : 'MongoDB + Mongoose',
    info : 'An excellent document database. Combined with Mongoose to simplify adding validation and business logic.',
    awesomeness: 10
  }, function() {
      console.log('finished populating things');
    }
  );
});


var specialty1 = new Specialty({_id: new mongoose.Types.ObjectId(), name: 'ICT'});
var specialty2 = new Specialty({_id: new mongoose.Types.ObjectId(), name: 'Awesome'});

var transportType1 = new TransportType({_id: new mongoose.Types.ObjectId(), name: "Car"});
var transport1 = new Transport({width: 10, length: 10, heigth: 10, maxWeight: 500, _type: transportType1._id});
var transport2 = new Transport({width: 10, length: 10, heigth: 10, maxWeight: 500, _type: transportType1._id});

var courier1 = new Courier({_id : new mongoose.Types.ObjectId(), name: 'Henk', age: 21, rating: 4, picture: 'http://placehold.it/350x350', status: 'Beschikbaar', _specialties: [specialty1._id, specialty2._id], _transportation: transport1, location:{ longitude: 4.676185, latitude: 51.893643}}); //Groenezoom 1 Lekkerkerk
var courier2 = new Courier({_id : new mongoose.Types.ObjectId(), name: 'Harry', age: 21, rating: 4, picture: 'http://placehold.it/350x350', status: 'Beschikbaar', _specialties: [specialty1._id, specialty2._id], _transportation: transport1, location:{ longitude: 4.484803, latitude: 51.917367}}); //Wijnhaven 99 Rotterdam
var courier3 = new Courier({_id : new mongoose.Types.ObjectId(), name: 'Harrold', age: 21, rating: 4, picture: 'http://placehold.it/350x350', status: 'Beschikbaar', _specialties: [specialty1._id, specialty2._id], _transportation: transport1, location:{ longitude: 4.457619, latitude: 51.933792}}); //sourystraat 10, Rotterdam
var courier4 = new Courier({_id : new mongoose.Types.ObjectId(), name: 'Henk2', age: 21, rating: 4, picture: 'http://placehold.it/350x350', status: 'Beschikbaar', _specialties: [specialty1._id, specialty2._id], _transportation: transport1, location:{ longitude: 4.480246, latitude: 51.928294}}); //Heer Bokelweg 155, Rotterdam(SADDL)

var package1 = new Package({_id : new mongoose.Types.ObjectId(), length: 10, width: 10, height: 10, weight: 10, description: "Televisie"});
var package2 = new Package({_id : new mongoose.Types.ObjectId(), length: 10, width: 10, height: 10, weight: 10, description: "Radio"});
var package3 = new Package({_id : new mongoose.Types.ObjectId(), length: 10, width: 10, height: 10, weight: 10, description: "Computer"});
var package4 = new Package({_id : new mongoose.Types.ObjectId(), length: 10, width: 10, height: 10, weight: 10, description: "Playstation 4"});

var order1 = new Order({_id : new mongoose.Types.ObjectId(), origin: 'Rotterdam', _courier: courier1, destination: 'Spijkenisse', _packages: package1._id });//_courier: courier1
var order2 = new Order({_id : new mongoose.Types.ObjectId(), origin: 'Rotterdam', _courier: courier1, destination: 'Spijkenisse', _packages: package1._id });//_courier: courier2
var order3 = new Order({_id : new mongoose.Types.ObjectId(), origin: 'Rotterdam', _courier: courier1, destination: 'Spijkenisse', _packages: package1._id });//_courier: courier3

var courierOrder1 = new courierOrder({_courier: courier1._id, _order: order1._id});
var courierOrder2 = new courierOrder({_courier: courier2._id, _order: order2._id});
var courierOrder3 = new courierOrder({_order: order3._id});


var user1 = new User({_id: new mongoose.Types.ObjectId(), provider: 'local', name: 'Test User', email: 'test@test.com', password: 'test', _courierOrder: [courierOrder1]});

var message1 = new Message({title: 'Te Laat', body: 'Door omstandigheden ben ik helaas een beetje later', _sender: courier1._id});
var message2 = new Message({title: 'File', body: 'Door een file ben ik helaas een beetje later', _sender: courier2._id});

// Clear old users, then add a default user

User.find({}).remove(function() {
  User.create(user1, function() {
      console.log('finished populating users');
    }
  );
});
Courier.find({}).remove(function() {
  Courier.create(courier1, courier2, courier3, courier4, function() {
    console.log('finished populating couriers');
  });
});
Package.find({}).remove(function() {
  Package.create(package1, package2, package3, package4, function() {
    console.log('finished populating packages');
  });
});

Order.find({}).remove(function () {
  Order.create(order1, order2, order3,function(){
    console.log('finished populating orders');
  } );
});
Specialty.find({}).remove(function() {
  Specialty.create(specialty1, specialty2, function() {
    console.log('finished populating Specialty');
  });
});
courierOrder.find({}).remove(function() {
  courierOrder.create(courierOrder1, courierOrder2, courierOrder3, function() {
    console.log('finished populating courierOrder');
  });
});
Transport.find({}).remove(function() {
  Transport.create(transport1, transport2, function() {
    console.log('finished populating Transport');
  });
});
TransportType.find({}).remove(function() {
  TransportType.create(transportType1, function() {
    console.log('finished populating TransportType');
  });
});
Message.find({}).remove(function(){
  Message.create(message1, message2, function(){
    console.log('finished populating Messages');
  });
});

