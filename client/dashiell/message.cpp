#include <message.h>

namespace dashiell {
    // Serialize an outgoing message to JSON
    std::string Message::toJson(bool pretty) {
        std::ostringstream os;
        boost::property_tree::ptree message;
        message.add("Action", Action);
        message.add("Payload", Payload);
        message.add("Guid", Guid);
        message.add("Hostname", Hostname);

        boost::property_tree::write_json(os, message, pretty);

        return os.str();
    }

    // Load an incoming message from JSON
    void Message::fromJson(std::string body){
        std::istringstream instream(body);
        boost::property_tree::ptree message;
        boost::property_tree::read_json(instream, message);

        Action = message.get<std::string>("Action", "");
        Payload = message.get<std::string>("Payload", "");
        Guid = message.get<std::string>("Guid", "");
    }
}