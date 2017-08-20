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
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;
    var workingDirectory = getDirectory(terminal.workingDirectory, state.wfs)[0];

    if (workingDirectory.data.length === 0) {
        terminal.output.push({
            text: 'ls: Directory is empty',
            prompt: false
        });
    }
    else {
        terminal.output.push({
            text: 'ls: Directory listing for ' + terminal.workingDirectory,
            prompt: false
        });
    }
    for (var i = 0; i < workingDirectory.data.length; i++) {
        var prefix = "FILE    ";
        if (workingDirectory.data[i].type === Constants.DIR_TYPE) {
            prefix = "DIR     ";
        }
        terminal.output.push({
            text: prefix + ' ' + workingDirectory.data[i].name,
            prompt: false
        });
    }

    return state;
}

export default run;
