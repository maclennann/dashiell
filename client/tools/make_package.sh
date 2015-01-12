#!/usr/bin/env bash

# Slightly adjusted from the OSQuery packaging script
# https://github.com/facebook/osquery/blob/master/tools/deployment/make_linux_package.sh
# Requires the fpm gem to be installed

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_DIR="$SCRIPT_DIR/.."
BUILD_DIR="$SOURCE_DIR/build"
export PATH="$PATH:/usr/local/bin"

#source $SCRIPT_DIR/../lib.sh

PACKAGE_VERSION=`git describe --tags HEAD`
DESCRIPTION="dashiell is a websockets agent for system interrogation."
OUTPUT_PKG_PATH="$BUILD_DIR/dashiell-$PACKAGE_VERSION.deb"

WORKING_DIR=/tmp/dashiell_packaging
INSTALL_PREFIX=$WORKING_DIR/prefix

#function usage() {
#    fatal "Usage: $0 -d DEPENDENCY_LIST"
#}

function parse_args() {
    while [ "$1" != "" ]; do
        case $1 in
            -d | --dependencies )   shift
            PACKAGE_DEPENDENCIES="${@}"
            ;;
            -h | --help )           usage
            ;;
        esac
        shift
    done
}

function check_parsed_args() {
    OUTPUT_PKG_PATH=$OUTPUT_PKG_PATH$PACKAGE_TYPE
}

function main() {
    parse_args $@
    check_parsed_args

    rm -rf $WORKING_DIR
    rm -f $OUTPUT_PKG_PATH
    mkdir -p $INSTALL_PREFIX

    BINARY_INSTALL_DIR="$INSTALL_PREFIX/usr/bin/"
    mkdir -p $BINARY_INSTALL_DIR
    cp "$BUILD_DIR/dashiell" $BINARY_INSTALL_DIR
    strip $BINARY_INSTALL_DIR/*

    IFS=',' read -a deps <<< "$PACKAGE_DEPENDENCIES"
    PACKAGE_DEPENDENCIES=
    for element in "${deps[@]}"
    do
        element=`echo $element | sed 's/ *$//'`
        PACKAGE_DEPENDENCIES="$PACKAGE_DEPENDENCIES -d \"$element\""
    done

    CMD="fpm -s dir -t deb \
    -n dashiell -v $PACKAGE_VERSION \
    $PACKAGE_DEPENDENCIES          \
    -p $OUTPUT_PKG_PATH            \
    --url http://github.com/maclennann/dashiel\
    -m norm.maclennan@gmail.com    \
    --vendor 'Norm MacLennan'      \
    --license BSD                  \
    --description \"$DESCRIPTION\" \
    \"$INSTALL_PREFIX/=/\""
    eval "$CMD"
}

main $@
