cmake_minimum_required(VERSION 2.8.4)
project(dashiell)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

set(SOURCE_FILES main.cpp
    dashiell/message.cpp
    dashiell/osquery_worker.cpp
    dashiell/facter_worker.cpp

    third-party/tables/tables_utils/time.cpp

    third-party/osquery/tables/system/linux/apt_sources.cpp
    third-party/tables/tables_additional/apt_sources.cpp

    third-party/osquery/tables/system/linux/deb_packages.cpp
    third-party/tables/tables_additional/deb_packages.cpp

    third-party/osquery/tables/system/linux/users.cpp
    third-party/tables/tables_additional/users.cpp

    third-party/osquery/tables/system/linux/processes.cpp
    third-party/tables/tables_additional/processes.cpp
)

add_executable(dashiell ${SOURCE_FILES})
include_directories(AFTER ${CMAKE_SOURCE_DIR}/third-party /usr/local/includes ${CMAKE_SOURCE_DIR}/include)

find_package(Boost COMPONENTS system thread random filesystem REQUIRED)
find_package(Threads REQUIRED)

find_library(procps_library NAMES libprocps.a procps)

find_library(FACTER NAMES facter PATHS /usr/local/lib REQUIRED)
find_library(APTPKG NAMES apt-pkg PATHS /usr/lib REQUIRED)
find_library(DPKG NAMES dpkg PATHS /usr/lib REQUIRED)

find_package(LibOsQuery REQUIRED)
include_directories(${LIBOSQUERY_INCLUDE_DIR})
target_link_libraries(dashiell ${LIBOSQUERY_LIBRARY_RELEASE})

find_package(Glog)
target_link_libraries(dashiell ${GLOG_LIBRARIES})
find_package(Gflags)
target_link_libraries(dashiell ${GFLAGS_LIBRARIES})
find_package(Dl)
target_link_libraries(dashiell ${DL_LIBRARIES})
find_package(Gtest REQUIRED)
target_link_libraries(dashiell ${Gtest_LIBRARIES})
find_package(RocksDB)
target_link_libraries(dashiell ${ROCKSDB_LIBRARIES})
find_package(BZip2)
target_link_libraries(dashiell ${BZIP2_LIBRARIES})
find_package(Readline)
target_link_libraries(dashiell ${READLINE_LIBRARIES})

target_link_libraries(dashiell ${Boost_SYSTEM_LIBRARY} ${Boost_FILESYSTEM_LIBRARY}
    ${Boost_THREAD_LIBRARY} ${CMAKE_THREAD_LIBS_INIT} ${Boost_RANDOM_LIBRARY} ${FACTER} ${APTPKG} ${DPKG}
    ${procps_library})
