/**
 * Author: houjianping
 * Date  : 17/1/16
 **/

const fs = require('fs');
const util = require('./util');

const METHOD_ONCREATE = "public void onCreate() {";
const REACT_APPLICATION_IMPORT = "import com.facebook.react.ReactApplication;";

const APP_KEY = '01c4b53fe374cd81';
const CONFIG_IMPORTS = [{src: "import com.jeejen.analysis.AnalysisConfig;"}];
const ANDROID_APPLICATION_PATH = "./android/app/src/main/java/com/jeejen/ifollow/MainApplication.java";

function updateApplication() {
    if(isContain(ANDROID_APPLICATION_PATH, METHOD_ONCREATE)) {
        let stringsSource = fs.readFileSync(ANDROID_APPLICATION_PATH, 'utf-8');
        CONFIG_IMPORTS.forEach(function(targetImport) {
            if(!isContain(ANDROID_APPLICATION_PATH, targetImport.src)) {
                stringsSource = stringsSource.replace(new RegExp(REACT_APPLICATION_IMPORT), REACT_APPLICATION_IMPORT + "\n" + targetImport.src);
            }
        });
        if(!isContain(ANDROID_APPLICATION_PATH, "AnalysisConfig.doApplicationConfig")) {
            stringsSource = stringsSource.replace(new RegExp("super.onCreate\\(\\);"), "super.onCreate();\n" + "    AnalysisConfig.doApplicationConfig(this, \"" + APP_KEY + "\");");
        }
        fs.writeFileSync(ANDROID_APPLICATION_PATH, stringsSource)
    }
}

function isContain(path, info) {
  return fs.readFileSync(path).indexOf(info) > -1;
}

module.exports = function attachToAndroid() {
    updateApplication();
};
