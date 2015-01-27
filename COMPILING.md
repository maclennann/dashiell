### STOP

This doesn't seem to work with newer versions of OSQUERY. I'm investigating what changed in the past month to break it, but due to my spotty knowledge of c++, it may take some time/luck/help.

#### Make the dashiell-client
* git clone https://github.com/maclennann/dashiell.git
* cd dashiell
* vagrant up
* vagrant ssh
* cd /vagrant
* cd /etc/apt/sources.list.d
* sudo wget http://nightlies.puppetlabs.com/cfacter-latest/repo_configs/deb/pl-cfacter-latest-trusty.list
* sudo apt-get update
* sudo apt-get install cfacter
* cd /vagrant/client
* git clone https://github.com/osquery/third-party.git
* git clone https://github.com/facebook/osquery.git third-party/osquery-source
* git clone https://github.com/zaphoyd/websocketpp.git third-party/websocketpp-source
* cd third-party/osquery
* sudo make deps # sorry, this takes a while
* make # sorry, this also takes a while
* cp -R third-party/websocketpp-source/websocketpp thirdparty/websocketpp
* cp -R third-party/osquery-source/osquery thirdparty/osquery
* cd ../..
* cmake ..
* make

* You can now run dashiell-client with `/vagrant/client/build/dashiell` (it will close immediately due to the server not running yet)

#### Install node.js and get the dashiell-server ready
* sudo apt-get install npm
* sudo ln -s /usr/bin/nodejs /usr/bin/node
* cd /vagrant/server
* npm install

* You can now run dashiell-server with `node /vagrant/server/index.js`

#### Now try it out!
* Open a couple of terminals (or use screen/tmux) in your vagrant box
* In one terminal, run `node /vagrant/server/index.js`
* In one terminal, run `/vagrant/client/build/dashiell`
* Now, in a web browser, go to `http://192.168.56.20:8080`
* You should see the dashiell web interface.
* Leave the query as-is (or type your own) and click "Run Query"
* Results should load after 3 seconds
* They're available pretty much instantly, but the timeout while the server waits for results to come in defaults to 2 seconds.
