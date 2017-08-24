import Constants, {createDirectory} from '../../constants';
// import { getDirectory } from '../../utils';

function getDirectory(directory, currDir) {
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

function run(state, params) {
    if (params.length === 1) {
        if (getDirectory(this.terminal.workingDirectory + '/' + params[0], state.wfs)) {
            this.output(params[0] + ': Directory already exists');
        }
        else {
            getDirectory(this.terminal.workingDirectory, state.wfs)[0].data.push(createDirectory(params[0]));
        }
    }
    else {
        this.output('Incorrect number of parameters');
    }

    return state;
}

export default run;
