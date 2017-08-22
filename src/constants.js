/* Constants */
const Constants = {
    // CONSTANTS
    STATE_KEY: 'state',
    DIR_TYPE: 'dir',
    FILE_TYPE: 'file',
    WAT_TERM_CONTENT_URL: 'http://wat-ter.ml/',

    // KEY CODES
    KEY_LEFT_ARROW: 37,
    KEY_UP_ARROW: 38,
    KEY_RIGHT_ARROW: 39,
    KEY_DOWN_ARROW: 40,
    KEY_I: 73,
    KEY_J: 74,
    KEY_K: 75,
    KEY_L: 76,
    KEY_ENTER: 13,
    KEY_BACKSPACE: 8
};
export default Constants;

/* Components */

export const createTerminal = () => ({
    history: [''],
    inProg: false,
    output: [],
    runningCommand: '',
    params: [],
    workingDirectory: '~'
});

export const createWindow = (x, y, width, height) => ({
    x,
    y,
    width,
    height,
    id: Date.now(),
    terminal: createTerminal()
});

export const createWorkspace = () => ({
    windows: [createWindow(0, 0, 100, 100)]
});

/* File System */

export const createDirectory = (name) => ({
    type: Constants.DIR_TYPE,
    name,
    data: []
});

export const createFile = name => ({
    type: Constants.FILE_TYPE,
    name,
    data: ''
});

export const createAlias = (alias, command) => ({
    alias,
    command
});
