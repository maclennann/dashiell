C++/Node websockets communication demo.

This requires a bit of manual setup right now and doesn't do too much, but I wanted to get it on the
ol' githubs so I can continue to work on it when I'm not at my desktop.

Basically, it's a websocket server running on node (also hosting an html page that acts as a web client) and a client written in c++.

In order to give the c++ client something interesting to do, I decided to use cfacter.

This requires a bit of manual setup. Download teh websocketpp headers into client/third-party.

Make and install cfacter into the default /usr/local.

TODO:

make setup easier.
make it do something interesting.
fix spelling errors.
actual instructions for compiling the c++
a blog post or two about how it works (once it works)


How do I make this work (roughly):

* Download `websocketpp` headers into client/third-party
* Build and install `cfacter` into /usr/local (the default just follow their instructions)
* Uhh...make sure you have node and cmake and some c++ build tools I guess I haven't enumerated them yet.
* In one terminal: navigate to `./server/` and run `node index` there is no output but a process should be hogging stdout
* In another terminal:
    * navigate to `./client/` make a `build` directory, go in there
    * run `cmake ..`
    * assuming that worked, run `make`
    * assuming that worked, run `magikarp`

The C++ client should successfully connect to your node server on port 8080. You should see "hostname" displayed on the server terminal.

When the client gets its "hostname" message back it will get its hostname from facter and send it back. You should see your hostname (and some json around it)
on the server terminal. Don't worry, the client only responds to "hostname" so no infinite loop.

Open a browser and go to `http://localhost:8080`. Click the button as many times as you want and watch the hostnames roll in to your server.
