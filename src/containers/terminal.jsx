import React from 'react';
import PropTypes from 'prop-types';

const Terminal = ({output, command, cursor, prompt, selected}) => {
    const leftText = command.slice(0, cursor);
    const cursorText = command.slice(cursor, cursor + 1) || ' ';
    const rightText = command.slice(cursor + 1);

    return (
        <div className='terminal'>
            <div className='terminal-text'>
                <p>WatTerm 1.0</p>
                {output.map(line =>
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
};

Terminal.propTypes = {
    output: PropTypes.array.isRequired,
    command: PropTypes.string.isRequired,
    cursor: PropTypes.number.isRequired,
    prompt: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired
};

export default Terminal;
