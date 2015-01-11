## Dashiell
### What is this?

In gif form, it is this:

![](https://raw.githubusercontent.com/maclennann/dashiell/master/demo.gif)

In word form, it is...

* A C++ application that you deploy to each of your servers that wraps [cfacter](http://github.com/puppetlabs/cfacter)
and [osquery](http://osquery.io) in websockets
* A nodejs web application that you deploy on one server, that allows you to query each of the aforementioned
servers for osquery/facter information via websockets.

Eventually, I'd like to turn this into a lightweight inventory management for a fleet of servers (e.g. are any of my servers running vulnerable versions of openssl?).

## Want to try it?

### I just want to try it - no compiling, please (or, I'll be working on the JS)!
* osquery and dashiell don't have any hosted packages (that I know of) so I have hosted them for your convenience.
    * Soon enough I hope to have at least a dashiell package on bintray or something.
* Clone this repo and enter the vagrant box
    * git clone https://github.com/maclennann/dashiell.git
    * cd dashiell
    * vagrant up
    * vagrant ssh
* Install cfacter
    * cd /etc/apt/sources.list.d
    * sudo wget http://nightlies.puppetlabs.com/cfacter-latest/repo_configs/deb/pl-cfacter-latest-trusty.list
    * sudo apt-get update
    * sudo apt-get install cfacter
* Install osquery
    * cd /vagrant
    * wget http://normmaclennan.com/dashiell/osquery-1.2.2-105.deb
    * sudo dpkg -i ./osquery-1.2.2-105.deb
* Install dashiell's dependencies
    * sudo apt-get install install libgflags-dev libgoogle-glog-dev libboost-system1.55 libboost-thread1.55 libboost-filesystem1.55 libboost-random1.55
* Download a dashiell binary
    * wget http://normmaclennan.com/dashiell/dashiell-0.1.1
    * chmod +x ./dashiell-0.1.1
* Install node.js
    * sudo apt-get install npm
    * sudo ln -s /usr/bin/nodejs /usr/bin/node
* Now you can run it!
    * Server: `node /vagrant/server/index.js`
    * Client: `/vagrant/dashiell-0.1.1`
    * Run these in different terminals:
        * Then browse to `http://192.168.56.20:8080`
        * Click the "Run Query" button and watch results come back

And that's all there is to it. Hopefully there will be less to it in the future
(you know, packages and stuff) and it will just be an apt-get away. But we aren't there
yet. Sorry.

Anyway, with this configuration, you can easily work on the JS and HTML without having to
worry about having all kinds of C++ stuff hanging around that you don't want.

If you find you need to change the C++ application for your work (or you just want to mess with it),
you can follow the directions in the following section. I hope to get those to be less insane
(or at least scripted) soon. But, again, `cmake` is not my thing. At all.

### I'm okay with compiling it (or, I'll be working on the C++):

See COMPILING.md in the root of this repo. I moved it out to the readme so I wasn't scaring anyone off
who thought it was part of the no-compile instructions. I hope to have them less insane soon, anyway

### Want to help?

See CONTRIBUTING.md in the root of this repo. Mostly I just need help with "everything", though.


### Dashiell?

You know, like [Dashiell Hammet](http://en.wikipedia.org/wiki/Dashiell_Hammett). Because it will help you investigate your
servers. And also because it looks and sounds a little bit like "da shell." Get it?

Well...it's still early, I guess I could change the name.
