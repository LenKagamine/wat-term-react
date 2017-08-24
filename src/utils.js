import Constants from './constants';

let currDir = {};

export default function test(wfs) {
    currDir = wfs;
}

export function getDirectory(directory) {
    const parts = directory.split('/');
    let dirStack = [currDir];
    for (let i = 1; i < parts.length; i++) {
        if (parts === '' || parts === '.') continue;
        if (parts[i] === '..') {
            currDir = dirStack[dirStack.length - 1];
            if (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        else if (parts[i] === '~') {
            // Go Back to Root
            while (dirStack.length != 1) {
                dirStack.pop();
            }
            continue;
        }
        let found = -1;
        for (let j = 0; j < currDir.data.length; j++) {
            // Found it
            if (currDir.data[j].name === parts[i] && currDir.data[j].type === Constants.DIR_TYPE) {
                found = j;
                break;
            }
        }
        if (found !== -1) {
            dirStack.push(currDir.data[j])
        }
        else {
            return false;
        }
        currDir = dirStack[dirStack.length - 1];
    }
    let path = '';
    for (let i = 0; i < dirStack.length; i++) {
        if (i !== 0) path += '/';
        path += dirStack[i].name;
    }
    return [currDir, path];
}

export function getFile(path) {
    const end = path.lastIndexOf('/');
    if (end === -1) return false;

    const parts = path.split('/');
    const filename = parts[parts.length - 1];
    const containingDirRes = getDirectory(path.substring(0, end));
    if (containingDirRes === false) return false;

    const containingPath = containingDirRes[1];
    const containingDir = containingDirRes[0];
    for (let j = 0; j < containingDir.data.length; j++) {
        if (containingDir.data[j].type === Constants.FILE_TYPE &&
            containingDir.data[j].name === filename) {
            return [containingDir.data[j], containingPath + '/' + filename];
        }
    }
    return false;
}

export function findWindow(state, id) {
    const windows = state.workspaces[state.selectedWorkspace].windows;
    for (let i = 0; i < windows.length; i++) {
        if (windows[i].id === id) {
            return i;
        }
    }
    return -1;
}
