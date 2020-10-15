#!/usr/bin/env node

/*
 * (c) 2018 BlackBerry Limited. All rights reserved.
 */

var fse = require('fs-extra');
require('shelljs/global');

module.exports = function(context) {

    var fs = require('fs'),
        path = require('path'),
        iOSHelper = require('../../../src/ios/iOSHelper.js'),
        plistHelper = new iOSHelper.PlistHelper(context),
        xcconfigHelper = new iOSHelper.XcconfigHelper(context),
        pluginPath = context.opts.plugin.dir,
        pathToiOSPlatform = path.join(context.opts.projectRoot, 'platforms', 'ios');

    //We need to read settings from default.xcconfig file
    //We need to set those settings to platforms/ios/cordova/build.xcconfig file
    //Those settings will be available in Build Settings in Xcode
    xcconfigHelper.editXcconfig();

    // Manage plist file
    plistHelper.editPlist();
    plistHelper.editEntitlementPlist();

    console.log('\x1b[32m%s\x1b[0m', 'Plugin cordova-plugin-bbd-base was successfully installed on ios.');

};
