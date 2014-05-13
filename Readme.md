Saddl API
====

Installation
====
To make this project work you have to install [vagrant](http://vagrantup.com) and VirtualBox.
when you have those installed execute the following commands
    $ vagrant up
    $ vagrant ssh
    //when asked for a password enter 'vagrant'
    $ npm install
    $ grunt serve:vagrant

the api will be accessible at `localhost:9000`

these commands wil create a virtual machine (Ubuntu 12.10) and install all dependencies, so you can keep developing on your own operating system, and the VM will watch the changes in these files
