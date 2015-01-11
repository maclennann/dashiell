#include <osquery/core.h>
#include <osquery/core/virtual_table.h>
#include <osquery/sql.h>
#include <osquery/database.h>
#include <boost/property_tree/json_parser.hpp>
#include <osquery_worker.h>

namespace dashiell{
    bool OsqueryWorker::isInit = false;

    OsqueryWorker::OsqueryWorker(){
        if(!isInit){
            char* argv[] = {};
            osquery::initOsquery(0,argv);
            isInit = true;
        }
    }

    std::string OsqueryWorker::runQuery(std::string query) {
        auto sql = osquery::SQL(query);
        if(sql.ok()) {
            boost::property_tree::ptree results_payload;
            int i = 0;
            for (const auto& r : sql.rows()) {
                i++;
                boost::property_tree::ptree serialized;
                auto s = osquery::serializeRow(r, serialized);
                results_payload.push_back(std::make_pair(std::to_string(i), serialized));
            }
            std::ostringstream os;
            boost::property_tree::write_json(os, results_payload, false);

            return os.str();
        }

        return "";
    }

    std::string OsqueryWorker::getHostname() {
        return osquery::getHostname();
    }
}