#!/bin/bash

wget http://nightlies.puppetlabs.com/cfacter-latest/repo_configs/deb/pl-cfacter-latest-trusty.list -O /etc/apt/sources.list.d/pl-cfacter-latest-trusty.list
apt-get update
#wget https://bintray.com/artifact/download/maclennann/deb/dashiell-0.1.1.deb -O /vagrant/dashiell-0.1.1.deb
#dpkg -i /vagrant/dashiell-0.1.1.deb
#apt-get install -f -y
sudo apt-get install npm cfacter --force-yes -y
ln -s /usr/bin/nodejs /usr/bin/node
