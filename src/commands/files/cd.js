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

function run(state, params, windowId) {
    var workspace = state.workspaces[state.selectedWorkspace];
    var currWindow = workspace.windows[windowId];
    var terminal = currWindow.terminal;

    if (params.length === 0) {
        terminal.workingDirectory = '~';
    }
    else if (params.length === 1) {
        const navResult = getDirectory(terminal.workingDirectory + '/' + params[0], state.wfs);
        if (navResult) {
            terminal.workingDirectory = navResult[1];
        }
        else {
            terminal.output.push({
                text: 'cd: No such directory ' + params[0],
                prompt: false
            });
        }
    }
    else {
        terminal.output.push({
            text: 'cd: Incorrect number of parameters',
            prompt: false
        });
    }

    return state;
}

export default run;
