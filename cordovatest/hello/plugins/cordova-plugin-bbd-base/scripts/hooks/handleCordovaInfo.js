#!/usr/bin/env node

/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 */

module.exports = function(context) {
    var path = require('path'),
        fs = require('fs'),
        configXmlPath = path.join(context.opts.projectRoot, 'config.xml'),
        ConfigParser = require('cordova-common').ConfigParser,
        configXmlObj = new ConfigParser(configXmlPath),
        basePluginPath = path.join(context.opts.projectRoot, 'plugins', 'cordova-plugin-bbd-base'),
        cordovaInfoJsonPath = path.join(basePluginPath, 'src', 'development-tools-info.json'),
        CordovaInfoHelper = require(path.join(basePluginPath, 'src', 'cordovaInfoHelper.js')).CordovaInfoHelper,
        cordovaInfoHelper = new CordovaInfoHelper(),
        applicationName = configXmlObj.name(),
        androidCordovaInfoJsonPath = path.join(
            context.opts.projectRoot, 'platforms', 'android', 'app', 'src', 'main', 'assets', 'development-tools-info.json'
        ),
        iosCordovaInfoJsonPath = path.join(
            context.opts.projectRoot, 'platforms', 'ios', applicationName, 'Resources', 'development-tools-info.json'
        );

    var cordovaInfo = JSON.parse(fs.readFileSync(cordovaInfoJsonPath, 'utf8')),
        updatedCordovaInfo = cordovaInfoHelper.getCordovaFrameworkInfo();

    // DEVNOTE: add constant value of bbdSdkForCordovaVersion, that was already set on Jenkins job during building 'Base' plugin
    updatedCordovaInfo.framework.bbdSdkForCordovaVersion = cordovaInfo.framework.bbdSdkForCordovaVersion;

    if (fs.existsSync(androidCordovaInfoJsonPath)) {
        cordovaInfoHelper.storeCordovaFrameworkInfoInJson(updatedCordovaInfo, androidCordovaInfoJsonPath);
    }

    if (fs.existsSync(iosCordovaInfoJsonPath)) {
        cordovaInfoHelper.storeCordovaFrameworkInfoInJson(updatedCordovaInfo, iosCordovaInfoJsonPath);
    }
}
