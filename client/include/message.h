#include <string.h>
#include <boost/property_tree/json_parser.hpp>

namespace dashiell {
    class Message {
    public:
        Message(){};
        Message(std::string action, std::string body) : Action(action), Payload(body){}
        std::string Action;
        std::string Payload;

        std::string toJson(bool pretty = false);
        void fromJson(std::string);
    };


    namespace Actions{
        const std::string QUERY = "query";
        const std::string FACT = "fact";
        const std::string REGISTER = "register_server";
        const std::string RESPONSE = "response";
    }

}