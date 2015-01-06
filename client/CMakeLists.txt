cmake_minimum_required(VERSION 2.8.4)
project(magikarp)

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=c++11")

set(SOURCE_FILES main.cpp)
add_executable(magikarp ${SOURCE_FILES})
include_directories(AFTER ${CMAKE_SOURCE_DIR}/third-party /usr/local/includes)


find_package(Boost COMPONENTS system thread random REQUIRED)
find_package(Threads REQUIRED)

find_library(FACTER NAMES facter PATHS /usr/local/lib REQUIRED)
target_link_libraries(magikarp ${Boost_SYSTEM_LIBRARY} ${Boost_THREAD_LIBRARY} ${CMAKE_THREAD_LIBS_INIT} ${Boost_RANDOM_LIBRARY} ${FACTER})
