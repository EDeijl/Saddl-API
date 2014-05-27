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

exports.google = function(req, res)
{
	Courier.find(function (err, courier) 
	{
		if (!err) 
		{
            var returnitem;
		    var json = JSON.stringify(courier, true); //json string
		    var contact = JSON.parse(json);			  //parse str into object
          
		    var nameclosest = '';
		    var timeclosest = '';
            
		    contact.forEach(function(item, index)
		    {
                //console.log(item);
                var huidigecourier = item._id;
                //console.log(huidigecourier);
			    if(item.status === 'Beschikbaar') //&& item.specialties === specialty en capacity)
			    {
                    //console.log(item.name);
                    var https = require('https');
                    var origins = 'Lekkerkerk';
                    var destinations = 'Rotterdam';
                    var mode = 'driver';
                    var sensor = 'false'; //gebruiker voor gps locatie bepalen op true ?
                    
                    var options  = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins='+origins+'&destinations='+destinations+'&mode='+mode+'&sensor='+sensor+'&key='+config.google_key;
                    //var beschikbaar = '';
                    //var specialisatie = '';
                    
                    req = https.request(options, function(res)//request naar google API sturen 
                    {
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
                            
                            if(time < timeclosest || timeclosest == '')
                            {
                                timeclosest = time;
                                nameclosest = huidigecourier;
                                var returnitem = item;
                                console.log(returnitem);
                            }
                        });
                    });
                    
                    req.on('error', function(e) 
                    {
                      console.error(e);
                    });	  
                    req.end();
                }
            });
		    //return res.send(courier);
            return res.send(returnitem);
		} 
		else 
		{
		  return res.send(err);
		}
	});
};