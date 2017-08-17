function run(state, params, terminal) {
    if (params.length === 1) {
        terminal.output.push({
            text: state.wsh.env[params[0]],
            prompt: false
        });
    }
    else if (params.length === 2) {
        state.wsh.env[params[0]] = params[1];
    }
    else {
        terminal.output.push({
            text: 'env: Incorrect number of parameters',
            prompt: false
        });
    }
    return state;
}

export default run;
