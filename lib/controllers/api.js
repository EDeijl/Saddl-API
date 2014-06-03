'use strict';

var mongoose = require('mongoose'),
	config = require('../config/config'),
    Thing = mongoose.model('Thing'),
	Courier = mongoose.model('Courier'),
	Transport = mongoose.model('Transport'),
	TransportType = mongoose.model('TransportType');
	
/**
 * Get awesome things
 */
exports.awesomeThings = function(req, res) {
  return Thing.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};

var huidigecourier = '';
var https = require('https');
var options = '';
exports.google = function(order)
{
	Courier.find({}).populate('_specialties').exec(function (err, courier) 
	{
		if (!err) 
		{      
            //uitlezen json van order die binnenkomt
            var specialtyvereist = 'ICT';
            //var jsonorder = JSON.stringify(order, true);                //json string
		    //var orderuitlezen = JSON.parse(jsonorder);	              //parse str into object
            //console.log(order);
            
            //
              
            var json = JSON.stringify(courier, true); //json string
            var contact = JSON.parse(json);			  //parse str into object
		    contact.forEach(function(item, index) //voor elke bezorger!!
		    {                
                //json gebruiker uitlezen voor check 
                var statusbezorger = item.status;
                var z = item._specialties.length;
                for(var i=0;i<z;i++)
                {           
                    var huidigecourier = item._id;
                    if(item.status === statusbezorger && item._specialties[i].name === specialtyvereist) //&& item.specialties === specialty en capacity)
                    {
                        //console.log(item.name);
                        
                        var origins = 'Lekkerkerk';
                        var destinations = 'Rotterdam';
                        var mode = 'driver';
                        var sensor = 'false'; //gebruiker voor gps locatie bepalen op true ?
                        
                        var options  = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&mode='+mode+'&sensor='+sensor+'&key='+config.google_key;
                        
                        order(options, huidigecourier);
                    }
                }  
            });
		} 
	});
};

var order = https.request(options, huidigecourier, function(res)//request naar google API sturen 
{
    var huidigecourier = huidigecourier;
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
        var time = timestring.replace(/[A-Za-z$-]/g, "");
        //console.log(time); //25
        
        if(time < timeclosest || timeclosest === '')
        {
            timeclosest = time;
            nameclosest = huidigecourier;
            //var returnitem = item;
            //console.log(returnitem);
        }
    });
});