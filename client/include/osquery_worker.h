

namespace dashiell{
    class OsqueryWorker{
    public:
        OsqueryWorker();
        std::string runQuery(std::string);
        std::string getHostname();
    protected:
        static bool isInit;
    };
}