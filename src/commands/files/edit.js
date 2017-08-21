import Constants, {createFile} from '../../constants';

function getDirectory(directory, currDir) {
    var parts = directory.split('/');
    var dirStack = [currDir];
    for (var i = 1; i < parts.length; i++) {
        if (parts === "" || parts === ".") continue;
        if (parts[i] === "..") {
            currDir = dirStack[dirStack.length - 1];
            if (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        else if (parts[i] == "~") {
            // Go Back to Root
            while (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        var found = -1;
        for (var j = 0; j < currDir.data.length; j++) {
            // Found it
            if (currDir.data[j].name === parts[i] && currDir.data[j].type === Constants.DIR_TYPE) {
                found = j;
                break;
            }
        }
        if (found != -1) {
            dirStack.push(currDir.data[j])
        }
        else {
            return false;
        }
        currDir = dirStack[dirStack.length - 1];
    }
    var path = "";
    for (var i = 0; i < dirStack.length; i++) {
        if (i != 0) path += "/";
        path += dirStack[i].name;
    }
    return [currDir, path];
}

function getFile(path, currDir) {
    var end = path.lastIndexOf("/");
    if (end === -1) return false;

    var parts = path.split("/");
    var filename = parts[parts.length - 1];
    var containingDirRes = getDirectory(path.substring(0, end), currDir);
    if (containingDirRes === false) return false;

    var containingPath = containingDirRes[1];
    var containingDir = containingDirRes[0];
    for (var j = 0; j < containingDir.data.length; j++) {
        if (containingDir.data[j].type === Constants.FILE_TYPE &&
            containingDir.data[j].name === filename) {
            return [containingDir.data[j], containingPath + "/" + filename];
        }
    }
    return false;
}

function run(state, params, windowId) {
    var workingDirectory = getDirectory(this.terminal.workingDirectory, state.wfs)[0];

    if (params.length === 1) {
        var path = this.terminal.workingDirectory + '/' + params[0];
        var navResult = getFile(path, state.wfs);
        var text = '';
        if (navResult === false) {
            createFile(params[0]);
        }
        else {
            text = navResult[0].data;
        }
        var result = window.prompt('Editing' + path + ':', text);
        getFile(path, state.wfs)[0].data = result;
    }
    else {
        this.output('Incorrect number of parameters', false);
    }

    return state;
}

export default run;
