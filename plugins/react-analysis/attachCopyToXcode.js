/**
 * Author: Jeejen.Dong
 * Date  : 2017/6/28
 **/

const xcode = require('xcode');
const path = require('path');
const fs = require('fs');

const GROUP_KEY = 'CrabCrashReportSDK';
let projectPath = './ios/app.xcodeproj/project.pbxproj';
let project = xcode.project(projectPath);
let sdkDir = './ios/app/CrabCrashReportSDK';

function onRemoveFile(project, file, groupKey) {
    let target = project.getFirstTarget();
    if (/^.+?\.a$/g.exec(file)) { // .a
        project.removeFile(file, groupKey, {});
        project.removeFramework(file, {
            target: target.uuid
        });
    } else if (/^.+?\.h$/g.exec(file)) { //.h
        project.removeHeaderFile(file, {
            target: target.uuid
        }, groupKey);
    } else if (/^.+?\.m$/g.exec(file)) { //.m
        project.removeSourceFile(file, {
            target: target.uuid
        }, groupKey);
    } else if (/^.+?\.framework$/g.exec(file)) { //.framework
        project.removeFile(file, groupKey, {
            customFramework: true,
            target: target.uuid
        });
        project.removeFramework(file, {
            customFramework: true,
            target: target.uuid
        });
    }
}

function onAddFile(project, file, groupKey) {
    let target = project.getFirstTarget();
    if (/^.+?\.a$/g.exec(file)) { // .a
        let pfile = project.addStaticLibrary(file, {
            target: target.uuid
        });
        project.addToPbxGroup(pfile, groupKey);
    } else if (/^.+?\.h$/g.exec(file)) { //.h
        project.addHeaderFile(file, {
            target: target.uuid
        }, groupKey);
    } else if (/^.+?\.m$/g.exec(file)) { //.m
        project.addSourceFile(file, {
            target: target.uuid
        }, groupKey);
    } else if (/^.+?\.framework$/g.exec(file)) { //.framework
        let pfile = project.addFramework(file, {
            customFramework: true,
            target: target.uuid
        });
        project.removeFromFrameworksPbxGroup(pfile);
        project.addToPbxGroup(pfile, groupKey);
    }
}

function lookupGroupKey(project, groupName, path) {
    let groupKey = project.findPBXGroupKey({
        name: groupName,
        path: path
    });

    if (!groupKey) {
        groupKey = project.pbxCreateGroup(groupName, path);
        let mainGroup = project.pbxProjectSection()[project.getFirstProject()['uuid']]['mainGroup'];
        if (mainGroup) {
            project.addToPbxGroup(groupKey, mainGroup);
        }
    }

    return groupKey;
}

function removeGroupChildren(project, groupKey) {
    let group = project.getPBXGroupByKey(groupKey);
    if (!group || !group.children) {
        return;
    }

    let children = Object.assign([], group.children);
    children.forEach((child) => {
        onRemoveFile(project, child.comment, groupKey);
    });
}

function addGroupChildren(project, filePath, groupKey) {
    let absPath = path.resolve(process.cwd(), filePath);
    let children = fs.readdirSync(absPath);
    if (!children) {
        return;
    }

    children.forEach((child) => {
        onAddFile(project, child, groupKey);
    });
}


module.exports = function attachCopyToXcode() {
    project.parse((err) => {
        if (err) {
            throw new Error(err);
        }
        let groupKey = lookupGroupKey(project, GROUP_KEY, 'app/CrabCrashReportSDK');
        if (!groupKey) {
            throw new Error('create group[' + GROUP_KEY + '] failed!');
        }

        removeGroupChildren(project, groupKey);
        addGroupChildren(project, sdkDir, groupKey);

        fs.writeFileSync(projectPath, project.writeSync());
        console.log('update project finished!');
    });
};