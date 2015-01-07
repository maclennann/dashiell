cmake_minimum_required(VERSION 2.8.4)
project(magikarp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

set(SOURCE_FILES main.cpp

    tables/tables_utils/time.cpp

    tables/tables/system/linux/apt_sources.cpp
    tables/tables_additional/apt_sources.cpp

    tables/tables/system/linux/deb_packages.cpp
    tables/tables_additional/deb_packages.cpp

    tables/tables/system/linux/users.cpp
    tables/tables_additional/users.cpp

    tables/tables/system/linux/processes.cpp
    tables/tables_additional/processes.cpp
)

add_executable(magikarp ${SOURCE_FILES})
include_directories(AFTER ${CMAKE_SOURCE_DIR}/third-party /usr/local/includes)

find_package(Boost COMPONENTS system thread random filesystem REQUIRED)
find_package(Threads REQUIRED)

find_library(procps_library NAMES libprocps.a procps)

find_library(FACTER NAMES facter PATHS /usr/local/lib REQUIRED)
find_library(APTPKG NAMES apt-pkg PATHS /usr/lib REQUIRED)
find_library(DPKG NAMES dpkg PATHS /usr/lib REQUIRED)

find_package(LibOsQuery REQUIRED)
include_directories(${LIBOSQUERY_INCLUDE_DIR})
target_link_libraries(magikarp ${LIBOSQUERY_LIBRARY_RELEASE})

find_package(Glog)
target_link_libraries(magikarp ${GLOG_LIBRARIES})
find_package(Gflags)
target_link_libraries(magikarp ${GFLAGS_LIBRARIES})
find_package(Dl)
target_link_libraries(magikarp ${DL_LIBRARIES})
find_package(Gtest REQUIRED)
target_link_libraries(magikarp ${Gtest_LIBRARIES})
find_package(RocksDB)
target_link_libraries(magikarp ${ROCKSDB_LIBRARIES})
find_package(BZip2)
target_link_libraries(magikarp ${BZIP2_LIBRARIES})
find_package(Readline)
target_link_libraries(magikarp ${READLINE_LIBRARIES})

target_link_libraries(magikarp ${Boost_SYSTEM_LIBRARY} ${Boost_FILESYSTEM_LIBRARY}
    ${Boost_THREAD_LIBRARY} ${CMAKE_THREAD_LIBS_INIT} ${Boost_RANDOM_LIBRARY} ${FACTER} ${APTPKG} ${DPKG}
    ${procps_library})
