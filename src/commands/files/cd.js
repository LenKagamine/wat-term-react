import Constants from '../../constants';

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

function run(state, params) {
    if (params.length === 0) {
        this.terminal.workingDirectory = '~';
    }
    else if (params.length === 1) {
        const navResult = getDirectory(this.terminal.workingDirectory + '/' + params[0], state.wfs);
        if (navResult) {
            this.terminal.workingDirectory = navResult[1];
        }
        else {
            this.output('No such directory ' + params[0]);
        }
    }
    else {
        this.output('Incorrect number of parameters');
    }

    return state;
}

export default run;
