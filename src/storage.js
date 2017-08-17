import Constants from './constants';

// INITIAL STATE
const id = +new Date();
const defaultStateObject = { [Constants.STATE_KEY]: {
    workspaces: [{
        windows: [{
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            id: id,
            terminal: {
                history: [''],
                inProg: false,
                output: [],
                runningCommand: '',
                workingDirectory: '~'
            }
        }]
    }],
    wfs: {
        type: Constants.DIR_TYPE,
        name: '~',
        data: [{
            type: Constants.FILE_TYPE,
            name: 'Welcome',
            data: 'Welcome to WatTerm! Here is some information about some stuff!\n'
        }]
    },
    wsh: {
        // environmental variables
        env: {
            'background': '#aaa',
            'prompt': '%w $ ',
            'username': 'WatTerm',
        },
        // alias mappings
        aliases: []
    },
    selectedWindow: id,
    selectedWorkspace: 0
}};

function load(callback) {
    chrome.storage.local.get(defaultStateObject, data => {
        callback(data[Constants.STATE_KEY]);
    });
}

function clear() {
    chrome.storage.local.clear(() => {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    return defaultStateObject[Constants.STATE_KEY];
}

function save(state) {
    chrome.storage.local.set({ [Constants.STATE_KEY]: state });
}

module.exports = {
    clear,
    load,
    save
};
