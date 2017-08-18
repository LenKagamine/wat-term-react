export default {
    // CONSTANTS
    STATE_KEY: 'state',
    DIR_TYPE: 'dir',
    FILE_TYPE: 'file',

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

export const createTerminal = () => {
    return {
        history: [''],
        inProg: false,
        output: [],
        runningCommand: '',
        workingDirectory: '~'
    };
};

export const createWindow = (x, y, width, height) => {
    return {
        x,
        y,
        width,
        height,
        id: +new Date(),
        terminal: createTerminal()
    };
};

export const createWorkspace = () => {
    return {
        windows: [createWindow(0, 0, 100, 100)]
    };
};
