import { createWorkspace } from '../constants';

function run(state, params) {
    if (params.length === 1) {
        if (params[0] === 'add') {
            state.workspaces.push(createWorkspace());
        }
        else {
            this.output('Unknown parameter ' + params[0]);
        }
    }
    else if (params.length === 2) {
        if (params[0] === 'remove') {
            state.workspaces.splice(params[1], 1);
        }
        else {
            this.output('Unknown parameter ' + params[0]);
        }
    }
    else {
        this.output('Incorrect number of parameters');
    }
    return state;
}

export default run;
