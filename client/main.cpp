#include <websocketpp/config/asio_no_tls_client.hpp>
#include <websocketpp/client.hpp>

#include <osquery_worker.h>
#include <message.h>
#include <facter_worker.h>

typedef websocketpp::client<websocketpp::config::asio_client> client;
using websocketpp::lib::placeholders::_1;
using websocketpp::lib::placeholders::_2;
using websocketpp::lib::bind;

using namespace dashiell;

// pull out the type of messages sent by our config
typedef websocketpp::config::asio_client::message_type::ptr message_ptr;
std::string hostname;

void on_message(client* c, websocketpp::connection_hdl hdl, message_ptr msg) {
    std::cout << msg->get_payload();
    Message recv, resp;
    recv.fromJson(msg->get_payload());
    resp = Message(Actions::RESPONSE, "Error", recv.Guid, hostname);

    if(recv.Action == Actions::QUERY){
        OsqueryWorker db;
        resp.Payload = db.runQuery(recv.Payload);
    }
    else if(recv.Action == Actions::FACT){
        FacterWorker facts;
        resp.Payload = facts.getFact(recv.Payload, facter::facts::format::json);
    }
    else { return; }

    client::connection_ptr con = c->get_con_from_hdl(hdl);
    con->send(resp.toJson());
}

void on_connect(client* c, websocketpp::connection_hdl hdl){
    client::connection_ptr con = c->get_con_from_hdl(hdl);


    Message registration = Message(Actions::REGISTER, "", "", hostname);
    con->send(registration.toJson());

    std::cout << "Waiting for queries..." << std::endl;
}

void on_disconnect(client* c, websocketpp::connection_hdl hdl){
    std::cout << "Connection closed..." << std::endl;
}

int main(int argc, char* argv[]) {
    client c;
    std::string uri = "ws://localhost:8080";

    OsqueryWorker db;
    hostname = db.getHostname();

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
