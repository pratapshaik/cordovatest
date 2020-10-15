#!/usr/bin/env node

/*
 * (c) 2019 BlackBerry Limited. All rights reserved.
 */

var execSync = require('child_process').execSync,
    // osEol = require('os').EOL, // on Mac returns \n, on Windows - \r\n, it does not work for Cordova CLI output where we have only \n 
    osEol = '\n',
    fs = require('fs');

function CordovaInfoHelper() {
    this.cordovaCmd = process.env.CORDOVA_BIN || 'cordova';
    this.versionRegExp = /\d+(\.\d+){0,5}/;
}

CordovaInfoHelper.prototype = {
    getCordovaVersion: function() {
        return execSync(this.cordovaCmd + ' -v').toString().split(osEol)[0].trim();
    },
    getCommonInfo: function() {
        return {
            os: process.platform,
            node: process.versions.node,
            npm: execSync('npm -v').toString().trim()
        };
    },
    getPluginsInfo: function() {
        var installedPluginsStr = execSync(this.cordovaCmd + ' plugins').toString();
        return installedPluginsStr.split(osEol)
            .filter(function(plugin) { // remove empty entries
                // filter for valid plugin strings, remove empty lines and telemetry message
                return Boolean(plugin) && (plugin.indexOf('cordova telemetry') < 0);
            })
            .map(function(plugin) { // get plugins id, name and version
                var pluginVersion = this.versionRegExp.exec(plugin)[0],
                    pluginParams = plugin.split(pluginVersion);
                return {
                    plugin: pluginParams[0].trim().replace(/[/'"]+/g, ''),
                    name: pluginParams[1].trim().replace(/[/'"]+/g, ''),
                    version: pluginVersion
                };
            }.bind(this));
    },
    getPlatformsInfo: function() {
        var installedPlatformsStr = execSync(this.cordovaCmd + ' platforms').toString();

        return installedPlatformsStr.split('Available platforms:')[0].split(osEol)
            .filter(function(platform) { // filter entries with supported platforms
                return platform.includes('ios') || platform.includes('android');
            })
            .map(function(platform) { // get platforms name and version
                var platformVersion = this.versionRegExp.exec(platform)[0];
                return {
                    platform: platform.split(platformVersion)[0].trim(),
                    version: platformVersion
                };
            }.bind(this));
    },
    getIonicInfo: function() {
        var ionicInfoParamsKeys = {
            cli: {
                ionicCli: 'ionic',
                ionicCli5: 'Ionic CLI'
            },
            framework: 'Ionic Framework'
        };

        try {
            var ionicInfoJson = execSync('ionic info --json', {stdio: 'pipe'}),
                ionicInfoList = JSON.parse(ionicInfoJson),
                ionicFramework = ionicInfoList.find(function(paramsObj) {
                    return paramsObj.key === 'Ionic Framework';
            });

            if (ionicFramework) {
                var ionicCliValue,
                    ionicFrameworkValue,
                    ionicProjectTypeValue = execSync('ionic config get type --no-color').toString()
                        .trim()
                        .replace(/[/'"]+/g, '');

                ionicInfoList.forEach(function(ionicInfo) {
                    switch (ionicInfo.key) {
                        case ionicInfoParamsKeys.cli.ionicCli:
                        case ionicInfoParamsKeys.cli.ionicCli5:
                            ionicCliValue = ionicInfo.value;
                            break;
                        case ionicInfoParamsKeys.framework:
                            ionicFrameworkValue = ionicInfo.value;
                            break;
                        default:
                            break;
                    }
                });
            }
        } catch (e) {
            // Ionic is not installed.
            // It is optional so we shouldn't do any actions here
        }

        return {
            cli: ionicCliValue || 'not installed',
            framework: ionicFrameworkValue || 'not installed',
            type: ionicProjectTypeValue || 'not installed'
        };
    },
    getCordovaFrameworkInfo: function() {
        return {
            framework: {
                name: 'Cordova',
                bbdSdkForCordovaVersion: '',
                version: this.getCordovaVersion(),
                common: this.getCommonInfo(),
                plugins: this.getPluginsInfo(),
                platforms: this.getPlatformsInfo(),
                ionic: this.getIonicInfo()
            }
        };
    },
    storeCordovaFrameworkInfoInJson: function(cordovaInfoObj, cordovaInfoJsonPath) {
        fs.writeFileSync(cordovaInfoJsonPath, JSON.stringify(cordovaInfoObj, null, 2), 'utf8');
    }
}

exports.CordovaInfoHelper = CordovaInfoHelper;
