import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Terminal from './terminal.jsx';
import Constants from '../constants.js';

class TerminalLink extends React.Component {
    constructor(props) {
        super(props);
        this.handleKey = this.handleKey.bind(this);
        this.state = {
            historyIndex: this.props.terminal.history.length - 1,
            cursor: this.props.terminal.history[this.props.terminal.history.length - 1].length
        };
    }

    componentDidMount() {
        if (this.props.selected) {
            this.input.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.historyIndex < 0) {
            this.setState({ historyIndex: 0 });
        }
        else if (this.state.historyIndex >= nextProps.terminal.history.length) {
            this.setState({ historyIndex: nextProps.terminal.history.length - 1 });
        }
    }

    handleKey(e) {
        const history = this.props.terminal.history;
        const command = history[this.state.historyIndex];

        if (!this.props.selected || this.props.terminal.inProg) {
            return;
        }
        if (e.keyCode === Constants.KEY_ENTER) {
            this.props.executeCommand(command);
            this.setState({
                cursor: 0,
                historyIndex: history.length
            });
        }
        else if (e.keyCode === Constants.KEY_UP_ARROW && this.state.historyIndex > 0) {
            this.setState({
                cursor: history[this.state.historyIndex - 1].length,
                historyIndex: this.state.historyIndex - 1
            });
        }
        else if (e.keyCode === Constants.KEY_DOWN_ARROW && this.state.historyIndex < history.length - 1) {
            this.setState({
                cursor: history[this.state.historyIndex + 1].length,
                historyIndex: this.state.historyIndex + 1
            });
        }
        else if (e.keyCode === Constants.KEY_LEFT_ARROW && this.state.cursor > 0) {
            this.setState({
                cursor: this.state.cursor - 1
            });
        }
        else if (e.keyCode === Constants.KEY_RIGHT_ARROW && this.state.cursor < command.length) {
            this.setState({
                cursor: this.state.cursor + 1
            });
        }
        else if (e.keyCode === Constants.KEY_BACKSPACE && this.state.cursor > 0) {
            this.props.updateCommand(
                command.slice(0, this.state.cursor - 1) + command.slice(this.state.cursor),
                this.state.historyIndex
            );
            this.setState({
                cursor: this.state.cursor - 1
            });
        }
        else if(e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey) {
            this.props.updateCommand(
                command.slice(0, this.state.cursor) + e.key + command.slice(this.state.cursor),
                this.state.historyIndex
            );
            this.setState({
                cursor: this.state.cursor + 1
            });
        }
    }

    render() {
        const prompt = this.props.prompt.replace('%w', this.props.terminal.workingDirectory);
        var command = this.props.terminal.history[this.state.historyIndex];
        if (command === undefined) {
            command = this.props.terminal.history[0];
        }

        return (
            <div
                className='terminal-link'
                ref={input => this.input = input}
                tabIndex='1'
                onKeyDown={this.handleKey}
            >
                <Terminal
                    output={this.props.terminal.output}
                    command={command}
                    cursor={this.state.cursor}
                    prompt={prompt}
                    selected={this.props.selected}
                />
            </div>
        );
    }
};

TerminalLink.propTypes = {
    terminal: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    prompt: PropTypes.string.isRequired,
    // Action Dispatch
    updateCommand: PropTypes.func.isRequired,
    executeCommand: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
    return {
        prompt: state.wsh.env.prompt
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateCommand: (text, index) => {
            dispatch({
                type: 'UPDATE_COMMAND',
                text,
                index
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

export default connect(mapStateToProps, mapDispatchToProps)(TerminalLink);
