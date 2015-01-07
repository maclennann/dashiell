#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>
#include <facter/facts/collection.hpp>
#include <osquery/core.h>
#include <osquery/core/virtual_table.h>
#include <osquery/sql.h>
#include <osquery/database.h>
#include <boost/property_tree/json_parser.hpp>

typedef websocketpp::client<websocketpp::config::asio_client> client;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

// pull out the type of messages sent by our config
typedef websocketpp::config::asio_client::message_type::ptr message_ptr;

facter::facts::collection facts;
void on_message(client* c, websocketpp::connection_hdl hdl, message_ptr msg) {
    boost::property_tree::ptree message_payload;
    std::istringstream ss(msg->get_payload());
    boost::property_tree::read_json(ss, message_payload);

    std::string action = message_payload.get<std::string>("action", "");
    std::string payload = message_payload.get<std::string>("payload", "");

    if(action == "query"){
        auto sql = osquery::SQL(payload);
        if(sql.ok()){
            client::connection_ptr con = c->get_con_from_hdl(hdl);
            boost::property_tree::ptree results_payload;
            osquery::serializeQueryData(sql.rows(), results_payload);
            std::ostringstream os;
            boost::property_tree::write_json(os, results_payload, false);
            std::string response_message = "{\"action\": \"response\", \"payload\": " + os.str() + "}";
            con->send(response_message);
        }
    }

    if(action == "fact"){
        client::connection_ptr con = c->get_con_from_hdl(hdl);
        std::stringstream value;
        std::set<std::string> query = {payload};
        facts.write(value, facter::facts::format::json, query);
        std::string response_message = "{\"action\": \"response\", \"payload\": " + value.str() + "}";
        con->send(response_message);
    }
}

void on_connect(client* c, websocketpp::connection_hdl hdl){
    std::cout << "Waiting for queries..." << std::endl;
    client::connection_ptr con = c->get_con_from_hdl(hdl);

    std::string register_message = "{\"action\": \"register_server\", \"payload\": \"" + osquery::getHostname() + "\"}";

    con->send(register_message);
}

void on_disconnect(client* c, websocketpp::connection_hdl hdl){
    std::cout << "Connection closed..." << std::endl;
}



int main(int argc, char* argv[]) {
    // Initialize our sources
    osquery::initOsquery(argc,argv);
    facts.add_default_facts();

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
