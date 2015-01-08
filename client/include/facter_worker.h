#include <facter/facts/collection.hpp>

namespace dashiell{
    class FacterWorker{
    public:
        FacterWorker();
        std::string getFact(std::string, facter::facts::format);
    protected:
        static bool isInit;
        static facter::facts::collection facts;
    };
}