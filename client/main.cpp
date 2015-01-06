#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>
#include <facter/facts/collection.hpp>

typedef websocketpp::client<websocketpp::config::asio_client> client;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

// pull out the type of messages sent by our config
typedef websocketpp::config::asio_client::message_type::ptr message_ptr;

facter::facts::collection facts;
void on_message(client* c, websocketpp::connection_hdl hdl, message_ptr msg) {
    if(msg->get_payload() != "hostname") return; // just because this is our hard-coded query

    client::connection_ptr con = c->get_con_from_hdl(hdl);
    std::cout << "Query " << msg->get_header() << " " <<  msg->get_payload() << std::endl;

    std::set<std::string> query = {msg->get_payload()};
    std::stringstream value;
    facts.write(value, facter::facts::format::json, query);

    con->send(value.str());
}

void on_connect(client* c, websocketpp::connection_hdl hdl){
    std::cout << "Waiting for queries..." << std::endl;
    client::connection_ptr con = c->get_con_from_hdl(hdl);

    con->send("hostname");
}

void on_disconnect(client* c, websocketpp::connection_hdl hdl){
    std::cout << "Connection closed..." << std::endl;
}



int main(int argc, char* argv[]) {

    facts.add_default_facts();
    std::set<std::string> stuff = {"hostname"};

    client c;
    std::string uri = "ws://localhost:8080";

    try {
        c.clear_access_channels(websocketpp::log::alevel::all);
        c.clear_error_channels(websocketpp::log::elevel::all);

        c.init_asio();

        c.set_open_handler(bind(&on_connect,&c,::_1));
        c.set_close_handler(bind(&on_disconnect,&c,::_1));
        c.set_message_handler(bind(&on_message,&c,::_1,::_2));

        websocketpp::lib::error_code ec;

        client::connection_ptr con = c.get_connection(uri, ec);
        c.connect(con);

        c.run();

    } catch (const std::exception & e) {
        std::cout << e.what() << std::endl;
    } catch (websocketpp::lib::error_code e) {
        std::cout << e.message() << std::endl;
    } catch (...) {
        std::cout << "other exception" << std::endl;
    }
}
