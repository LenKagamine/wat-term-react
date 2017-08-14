import React from 'react';
import PropTypes from 'prop-types';

import Constants from '../constants';

class Terminal extends React.Component {
    constructor(props) {
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(e) {
        e.preventDefault();
        if (!this.props.selected || this.props.terminal.inProg) {
            return;
        }
        if (e.keyCode === Constants.KEY_ENTER) {
            console.log('Enter');
        }
        else {
            console.log(e.keyCode);
        }
    }

    componentDidMount() {
        this.textInput.focus();
    }

    render() {
        const prompt = this.props.terminal.workingDirectory + '$ ';
        return <div className='terminal'>
            <div style={{
                width: '0',
                height: '0',
                overflow: 'hidden'
            }}>
                <input type='text' onKeyDown={this.handleKeyDown} ref={input => this.textInput = input}></input>
            </div>
            <div className='terminal-text'>
                <p>WatTerm 1.0</p>
                {this.props.terminal.history.map(line =>
                    <p>
                        <span className='prompt'>
                            {prompt}
                        </span>
                        {line}
                    </p>
                )}
                <p>
                    <span className='prompt'>{prompt}</span>
                    <span className='before'></span>
                    <span className='cursor blink'>&nbsp;</span>
                    <span className='after'></span>
                </p>
            </div>
        </div>
    }
};

Terminal.propTypes = {
    terminal: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired
};

export default Terminal;
