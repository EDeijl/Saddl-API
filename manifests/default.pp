class must-have {
  include apt

  apt::ppa { "ppa:chris-lea/node.js": }

  exec { 'apt-get update':
    command => '/usr/bin/apt-get update',
    before => Apt::Ppa["ppa:chris-lea/node.js"],
  }

  exec { 'apt-get update 2':
    command => '/usr/bin/apt-get update',
    require => Apt::Ppa["ppa:chris-lea/node.js"],
  }

  exec { 'install gem compass':
    command => '/opt/ruby/bin/gem install compass',
    creates => "/opt/ruby/bin/compass",
    require => Exec["apt-get update 2"],
  }

  exec { 'install gem sass':
    command => '/opt/ruby/bin/gem install sass',
    creates => "/opt/ruby/bin/sass",
    require => Exec["apt-get update 2"],
  }

  exec { 'install yeoman':
    command => '/usr/bin/npm install -g yo phantomjs',
    creates => [
      '/usr/lib/node_modules/bower/bin/bower',
      '/usr/lib/node_modules/yo/bin/yo',
      '/usr/lib/node_modules/grunt-cli/bin/grunt',
      '/usr/lib/node_modules/phantomjs/bin/phantomjs'
      ],
    require => [ Exec["apt-get update 2"], Package["nodejs"] ],
  }

  exec { 'install webapp generator':
    command => '/usr/bin/npm install -g generator-angular-fullstack',
    creates => '/usr/lib/node_modules/generator-angular-fullstack',
    require => Exec["install yeoman"],
  }

  file_line { "update hostname in gruntfile": 
    line => "\t\t\t\thostname: '0.0.0.0'", 
    path => "/home/vagrant/Gruntfile.js", 
    match => "hostname: '.*'", 
    ensure => present,
    require => Exec["install yeoman"],
  }

  package { ["vim",
             "bash",
             "nodejs",
             "git-core",
             "fontconfig",
             "mongodb"]:
    ensure => present,
    require => Exec["apt-get update 2"],
  }


}

include must-have
