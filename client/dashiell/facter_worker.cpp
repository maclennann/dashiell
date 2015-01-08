#include <facter_worker.h>

namespace dashiell{
    bool FacterWorker::isInit = false;
    facter::facts::collection FacterWorker::facts;

    FacterWorker::FacterWorker(){
        if(!isInit){
            facts.add_default_facts();
            isInit = true;
        }
    }

    std::string FacterWorker::getFact(std::string query, facter::facts::format format){
        std::stringstream value;
        std::set<std::string> querySet = {query};
        facts.write(value, format, querySet);

        return value.str();
    }
}