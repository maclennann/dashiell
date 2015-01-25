cmake_minimum_required(VERSION 2.8.4)
project(dashiell)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} "${CMAKE_SOURCE_DIR}/cmake/")

set(SOURCE_FILES main.cpp
    dashiell/message.cpp
    dashiell/osquery_worker.cpp
    dashiell/facter_worker.cpp

    third-party/osquery-source/build/ubuntu/generated/tables_utils/time.cpp

    third-party/osquery/tables/system/linux/apt_sources.cpp
    third-party/osquery-source/build/ubuntu/generated/tables_additional/apt_sources.cpp

    third-party/osquery/tables/system/linux/deb_packages.cpp
    third-party/osquery-source/build/ubuntu/generated/tables_additional/deb_packages.cpp

    third-party/osquery/tables/system/linux/users.cpp
    third-party/osquery-source/build/ubuntu/generated/tables_additional/users.cpp

    third-party/osquery/tables/system/linux/processes.cpp
    third-party/osquery-source/build/ubuntu/generated/tables_additional/processes.cpp
)

add_executable(dashiell ${SOURCE_FILES})
include_directories(AFTER ${CMAKE_SOURCE_DIR}/third-party /usr/local/includes ${CMAKE_SOURCE_DIR}/include)

set(Boost_USE_STATIC_LIBS ON)
find_package(Boost COMPONENTS system thread random filesystem REQUIRED)
find_package(Threads REQUIRED)

find_library(procps_library NAMES libprocps.a procps REQUIRED)

find_library(FACTER NAMES facter PATHS /usr/local/lib REQUIRED)
find_library(APTPKG NAMES apt-pkg PATHS /usr/lib REQUIRED)
find_library(DPKG NAMES dpkg PATHS /usr/lib REQUIRED)

find_package(LibOsQuery REQUIRED)
include_directories(${LIBOSQUERY_INCLUDE_DIR})
target_link_libraries(dashiell ${LIBOSQUERY_LIBRARY_RELEASE})

find_package(Glog REQUIRED)
target_link_libraries(dashiell ${GLOG_LIBRARIES})
find_package(Gflags REQUIRED)
target_link_libraries(dashiell ${GFLAGS_LIBRARIES})
find_package(Dl REQUIRED)
target_link_libraries(dashiell ${DL_LIBRARIES})
find_package(Gtest REQUIRED)
target_link_libraries(dashiell ${Gtest_LIBRARIES})
find_package(RocksDB REQUIRED)
target_link_libraries(dashiell ${ROCKSDB_LIBRARIES})
find_package(BZip2 REQUIRED)
target_link_libraries(dashiell ${BZIP2_LIBRARIES})
find_package(Readline REQUIRED)
target_link_libraries(dashiell ${READLINE_LIBRARIES})

target_link_libraries(dashiell ${Boost_SYSTEM_LIBRARY} ${Boost_FILESYSTEM_LIBRARY}
    ${Boost_THREAD_LIBRARY} ${CMAKE_THREAD_LIBS_INIT} ${Boost_RANDOM_LIBRARY} ${FACTER} ${APTPKG} ${DPKG}
    ${procps_library})

set(PACKAGE_DEPENDENCIES
    libgoogle-glog0
    cfacter
)

function(JOIN VALUES GLUE OUTPUT)
    string (REPLACE ";" "${GLUE}" _TMP_STR "${VALUES}")
    set (${OUTPUT} "${_TMP_STR}" PARENT_SCOPE)
endfunction(JOIN)

JOIN("${PACKAGE_DEPENDENCIES}" ", " PACKAGE_DEPENDENCIES)

add_custom_target(
    packages
    ./tools/make_package.sh -d "${PACKAGE_DEPENDENCIES}"
    WORKING_DIRECTORY "${CMAKE_SOURCE_DIR}"
    COMMENT "Building linux packages (no custom config)" VERBATIM
)
