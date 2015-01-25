#!/bin/bash

wget http://nightlies.puppetlabs.com/cfacter-latest/repo_configs/deb/pl-cfacter-latest-trusty.list -O /etc/apt/sources.list.d/pl-cfacter-latest-trusty.list
echo "deb http://dl.bintray.com/maclennann/deb /" > /etc/apt/sources.list.d/dashiell.list

apt-get update
sudo apt-get install npm dashiell --force-yes -y

ln -s /usr/bin/nodejs /usr/bin/node
