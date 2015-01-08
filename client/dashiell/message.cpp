#include <message.h>

namespace dashiell {
    std::string Message::toJson(bool pretty) {
        std::ostringstream os;
        boost::property_tree::ptree message;
        message.add("Action", Action);
        message.add("Payload", Payload);

        boost::property_tree::write_json(os, message, pretty);

        return os.str();
    }

    void Message::fromJson(std::string body){
        std::istringstream instream(body);
        boost::property_tree::ptree message;
        boost::property_tree::read_json(instream, message);

        Action = message.get<std::string>("Action", "");
        Payload = message.get<std::string>("Payload", "");
    }
}