### What is this?

A barely-working (proof-of)-proof-of-concept of plugging [cfacter](http://github.com/puppetlabs/cfacter) 
and [osquery](http://osquery.io) into websockets, so you can query your servers for facts or osquery 
tables from the comfort of your web browser.

Eventually, I'd like to turn this into a lightweight inventory management for a fleet of servers (e.g. are any of my servers running vulnerable versions of openssl?)

Right now, it kind of works.

Biiiiiig disclaimer, I am by no means a C++ developer - I just managed to fumble my way through this. 
Though the code makes me look worse than I am, since I was trying to learn everything all at once, 
code quality suffered.

If you want to try it out, I basically dumped all of my actions into a step-by-step below. I'm going to 
pare down the steps to only do necessarily things and script out all of the bootstrapping eventually, 
but I literally just got the working and needed to tell the world.

#### Dashiell?

You know, like [Dashiell Hammet](http://en.wikipedia.org/wiki/Dashiell_Hammett). Because it will help you investigate your 
servers. And also because it looks and sounds a little bit like "da shell." Get it?

Well...it's still early, I guess I could change the name.

### What I'm looking for:

* Actual C++ devs!
    * I have no idea what I'm doing.
    * I know the language well enough, but the whole library and cmake and all that stuff is foreign to me
    * Especially helpful would be someone to tell me if there is an easier way to make use of osquery tables 
that isn't compiling them into dashiell.

* Javascript devs
    * I'm pretty good with javascript, but I don't want to exclude anyone.

* Ideas
    * I have a general idea of where I'll be going, but I'm open to suggestions

### How to try this (broadly): 

* download, build, install osquery and cfacter
* copy some third-party dependencies to the expected directory
* `cmake` and `make` dashiell client

### How to make this do things (humanscript):

* mkdir dashiell
* cd dashiell
* git clone https://github.com/facebook/osquery.git
* mv osquery/Vagrantfile ./
* on line 10 of the Vagrantfile, insert: `box.vm.network :private_network, ip: "192.168.56.100"`
* vagrant up ubuntu14
* vagrant ssh ubuntu14
* cd /vagrant/osquery
* sudo make deps
* get and drink a coffee
* make
* get two beers. drink one.
* come up with a name for your project, search github to ensure it isn't already taken
* sudo make install
* cross your fingers
* cd ..
* git clone https://github.com/puppetlabs/cfacter.git
* cd cfacter
* git submodule --init --recursive
* sudo apt-get install build-essential cmake libssl-dev libyaml-cpp-dev libblkid-dev libcurl4-openssl-dev ruby-dev
* mkdir release
* cd release
* cmake ..
* make
* drink the second beer.
* if alcohol makes you sleepy, take a quick nap
* sudo make install
* cd /vagrant
* git clone https://github.com/maclennann/dashiell.git
* git clone https://github.com/zaphoyd/websocketpp.git
* cp -r websocketpp/websocketpp dashiell/client/third-party
* cp -r osquery/third-party/* dashiell/client/third-party/
* cp -r osquery/osquery/ dashiell/client/third-party
* cp -r osquery/build/ubuntu/generated/ dashiell/client/third-party/tables
* cd dashiell/client
* cmake .
* make
* the tedious part is over. take a moment to breathe.
* sudo apt-get install npm
* cd ../server
* npm install
* sudo ln -s /usr/bin/nodejs /usr/bin/node*

* open a second terminal (either via tmux or vagrant sshing from another terminal)

* (in one terminal)
* cd /vagrant/dashiell/server
* node index

* (in another terminal)
* cd /vagrant/dashiell/client
* ./dashiell

* in a web browser, go to `192.168.56.100:8080` (or if you're running locally, localhost:8080)

* open the browser devtools

* type `select * from deb_packages where name='bash'` into the first textbox
* click `query`
* watch the terminals to see the queries hitting the dashiell server and client
* look at your browser devtools for the response

* type `hostname` into the second textbox
* click `fact`
* again, watch for the results
