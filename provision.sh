#!/bin/bash

wget http://nightlies.puppetlabs.com/cfacter-latest/repo_configs/deb/pl-cfacter-latest-trusty.list -O /etc/apt/sources.list.d/pl-cfacter-latest-trusty.list
apt-get update
wget http://normmaclennan.com/dashiell/osquery-1.2.2-105.deb -O /vagrant/osquery.deb
wget http://normmaclennan.com/dashiell/dashiell-0.1.1 -O /vagrant/dashiell
chmod +x /vagrant/dashiell
sudo apt-get install cfacter libgflags-dev libgoogle-glog-dev libboost-system1.55 libboost-thread1.55 libboost-filesystem1.55 libboost-random1.55 npm --force-yes -y
ln -s /usr/bin/nodejs /usr/bin/node
