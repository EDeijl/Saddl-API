Saddl API [![Build Status](https://travis-ci.org/EDeijl/Saddl-API.svg?branch=master)](https://travis-ci.org/EDeijl/Saddl-API)
====

Installation
====
To make this project work you have to install [vagrant](http://vagrantup.com) and VirtualBox.
when you have those installed execute the following commands:

    $ vagrant up
    $ vagrant ssh
    //when asked for a password enter 'vagrant'
    $ cd /vagrant
    $ npm install
    $ bower install
    $ grunt serve:vagrant

the api will be accessible at `localhost:9000`

these commands wil create a virtual machine (Ubuntu 12.10) and install all dependencies, so you can keep developing on your own operating system, and the VM will watch the changes in these files


Using the API
====
To use the api you need an account and an access token. To get an access token you can post
a json object with your username and password to /api/token, this will get you an access token.
Next you can do requests to the endpoints with /api/{resource}?access_token={access_token}.
