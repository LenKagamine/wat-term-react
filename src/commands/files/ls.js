import Constants, {createDirectory} from '../../constants';

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

function run(state, params, windowId) {
    const workingDirectory = getDirectory(this.terminal.workingDirectory, state.wfs)[0];

    if (workingDirectory.data.length === 0) {
        this.output('Directory is empty');
    }
    else {
        this.output('Directory listing for ' + this.terminal.workingDirectory);
    }
    for (var i = 0; i < workingDirectory.data.length; i++) {
        this.output(
            (workingDirectory.data[i].type === Constants.DIR_TYPE ?
                'FILE    ' :
                'DIR     ') + workingDirectory.data[i].name, false, false);
    }

    return state;
}

export default run;
