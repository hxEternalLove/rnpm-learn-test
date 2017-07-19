/**
 * Author: houjianping
 * Date  : 17/1/16
 **/

const fs = require('fs');
const path = require('path');
const util = require('./util');
const copyToXcode = require('./attachCopyToXcode');

const FILE_ORIGINAL = 'ios/RNBaiduAnalysis/CrabCrashReportSDK/';
const FILE_TARGET = '/ios/app/CrabCrashReportSDK/';
const APPLICATION_PATH = "./ios/app/AppDelegate.m";
const PLUGIN_PATH = "/../plugins/react-analysis/";
const REACT_APPLICATION_IMPORT = '#import <React/RCTRootView.h>';
const APPKEY = '9b302e4354587d64';


function updateAppDelegate() {
    let stringsSource = fs.readFileSync(APPLICATION_PATH, 'utf-8');
    let configImports = [{src: '#import "CrabCrashReport.h"'}, {src: '#import "ChatBaiduAnalysis.h"'}];
    configImports.forEach(function(targetImport) {
        if(!isContain(APPLICATION_PATH, targetImport.src)) {
            stringsSource = stringsSource.replace(new RegExp(REACT_APPLICATION_IMPORT), REACT_APPLICATION_IMPORT + "\n" + targetImport.src);
        }
    });
    if(!isContain(APPLICATION_PATH, "@interface")){
        stringsSource = stringsSource.replace(new RegExp("@implementation AppDelegate"),
            "@interface AppDelegate ()<"+"CrashSignalCallBackDelegate>\n"
            + '@end\n'
            + '@implementation AppDelegate\n'
            + '// 百度Crash\n'
            + '- (void)crashCallBack{\n'
            + '  [ChatBaiduAnalysis sendCustomMessage];\n'
            + '}');
    }
    if(!isContain(APPLICATION_PATH, "CrabCrashReport.h")){
        copyToXcode();
        stringsSource = stringsSource.replace(new RegExp("/\*jsCodeLocation;"), 'jsCodeLocation;\n'
            + '  NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];\n'
            + '  NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];\n'
            + '  [[CrabCrashReport sharedInstance] initCrashReporterWithAppKey:@"9b302e4354587d64" AndVersion:app_Version AndChannel:@"AppStore"];\n'
            + '  // 设置代理对象\n'
            + '  [[CrabCrashReport sharedInstance] setCrashCallBackDelegate:self];');
    }
    if(isContain(APPLICATION_PATH, "initCrashReporterWithAppKey")){
        // 更换AppKey
        stringsSource = stringsSource.replace(new RegExp('initCrashReporterWithAppKey:@"[\\S]*"'), 'initCrashReporterWithAppKey:@"' + APPKEY + '"');
    }

    fs.writeFileSync(APPLICATION_PATH, stringsSource)
}

function copyFiles() {
    let folderDir = process.cwd() + PLUGIN_PATH + FILE_ORIGINAL;
    getFolderFileList(folderDir, function (pathname) {
        let resPath = process.cwd() + "/" + FILE_TARGET + pathname;
        util.makeDir(resPath.substring(0, resPath.lastIndexOf('/')));
        util.copyFile(process.cwd() + PLUGIN_PATH + FILE_ORIGINAL  + pathname, process.cwd() + "/" + FILE_TARGET + pathname);
    });
}

function isContain(path, info) {
    return fs.readFileSync(path).indexOf(info) > -1;
}

function getFolderFileList(dir, callback) {
    fs.readdir(dir, function (err, files) {
            files.forEach((item) => {
                let pathname = path.join(dir, item);
                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
                        getFolderFileList(pathname, callback);
                    } else {
                        let path = process.cwd() + PLUGIN_PATH + FILE_ORIGINAL;
                        callback(pathname.substring(path.length - 7), function () {
                            next(i + 1);
                        });
                    }
                });
            })

    });
}

module.exports = function attachToIOS() {
    copyFiles();
    updateAppDelegate();
};
