import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Constants from '../constants';

class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.handleKey = this.handleKey.bind(this);
        this.state = {cursor: this.props.command.length};
    }

    handleKey(e) {
        const text = this.textInput.value;
        this.setState({
            cursor: this.textInput.selectionStart
        });

        if (!this.props.selected || this.props.terminal.inProg) {
            return;
        }
        if (e.keyCode === Constants.KEY_ENTER) {
            this.props.executeCommand(text);
        }
        else if (e.keyCode === Constants.KEY_UP_ARROW) {
            this.props.moveHistoryUp();
        }
        else if (e.keyCode === Constants.KEY_DOWN_ARROW) {
            this.props.moveHistoryDown();
        }
        else {
            this.props.updateCommand(text);
        }
        // e.preventDefault();
    }

    componentDidMount() {
        this.textInput.focus();
        this.textInput.value = this.props.command;
    }

    render() {
        const prompt = this.props.terminal.workingDirectory + '$ ';
        const command = this.props.command;
        const leftText = command.slice(0, this.state.cursor);
        const cursorText = command.slice(this.state.cursor, this.state.cursor + 1) || ' ';
        const rightText = command.slice(this.state.cursor + 1);

        return (
            <div className='terminal'>
                <div style={{
                    // width: '0',
                    // height: '0',
                    // overflow: 'hidden'
                }}>
                    <input
                        type='text'
                        // onKeyDown={this.handleKey}
                        // onKeyPress={this.handleKey}
                        onKeyUp={this.handleKey}
                        ref={input => this.textInput = input} />
                </div>
                <div className='terminal-text'>
                    <p>WatTerm 1.0</p>
                    {this.props.terminal.history.slice(0, -1).map(line =>
                        <p>
                            <span className='prompt'>
                                {prompt}
                            </span>
                            {line}
                        </p>
                    )}
                    <p>
                        <span className='prompt'>{prompt}</span>
                        <span className='before'>{leftText}</span>
                        <span className='cursor blink'>{cursorText}</span>
                        <span className='after'>{rightText}</span>
                    </p>
                </div>
            </div>
        );
    }
};

Terminal.propTypes = {
    terminal: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    moveHistoryUp: PropTypes.func.isRequired,
    moveHistoryDown: PropTypes.func.isRequired,
    updateCommand: PropTypes.func.isRequired,
    executeCommand: PropTypes.func.isRequired,
    command: PropTypes.string.isRequired
};

const mapStateToProps = state => {
    return {
        command: state.workspaces[state.selectedWorkspace]
                      .windows[state.selectedWindow]
                      .terminal
                      .history[state.workspaces[state.selectedWorkspace]
                                    .windows[state.selectedWindow]
                                    .terminal.historyIndex]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        moveHistoryUp: () => {
            dispatch({
                type: 'MOVE_HISTORY_UP'
            })
        },
        moveHistoryDown: () => {
            dispatch({
                type: 'MOVE_HISTORY_DOWN'
            })
        },
        updateCommand: (text, cursor) => {
            dispatch({
                type: 'UPDATE_COMMAND',
                text
            })
        },
        executeCommand: text => {
            dispatch({
                type: 'EXECUTE_COMMAND',
                text
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Terminal);
