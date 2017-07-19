/**
 * Author: Jeejen.Dong
 * Date  : 17/1/11
 **/
var fs = require('fs');
var path = require('path');

exports.copyFile = function copyFile(srcPath, dstPath) {
    var source = fs.readFileSync(srcPath);
    fs.writeFileSync(dstPath, source);
};

exports.makeDir = function makeDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        var tmpPath;
        dirPath.split(path.sep).forEach(function(dirName) {
            if (tmpPath) {
                tmpPath = path.join(tmpPath, dirName);
            } else {
                tmpPath = path.join("/");
            }
            if (!fs.existsSync(tmpPath)) {
                if (!fs.mkdirSync(tmpPath)) {
                    return false;
                }
            }
        });
    }
};

exports.clearEmptyDir = function clearEmptyDir(dirPath) {
    var dirs = dirPath.split(path.sep);
    for (var i = dirs.length; i > 0; i--) {
        var dir = dirs.slice(0, i).join(path.sep);
        var files = fs.readdirSync(dir);
        if (!files || files.length == 0) {
            fs.rmdirSync(dir);
        } else {
            return;
        }
    }
};

exports.moveFileToDir = function moveFileToDir(srcPath, dstPath) {
    exports.makeDir(dstPath);

    fs.readdirSync(srcPath).forEach(function(file) {
        var srcFile = path.resolve(srcPath, file);
        var dstFile = path.resolve(dstPath, file);

        exports.copyFile(srcFile, dstFile);
        fs.unlinkSync(srcFile);
    });

    exports.clearEmptyDir(srcPath);
};