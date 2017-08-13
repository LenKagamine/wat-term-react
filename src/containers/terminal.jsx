import React from 'react';
import PropTypes from 'prop-types';

const Terminal = ({ terminal }) => {
    return <div className='terminal'>
        <div style={{
            width: '0',
            height: '0',
            overflow: 'hidden'
        }}>
            <input type='text'></input>
        </div>
        <div>
            <p>WatTerm 1.0</p>
            {terminal.history.map(line =>
                <p>
                    <span className='prompt'>
                        {terminal.workingDirectory} $
                    </span>
                    {line}
                </p>
            )}
            <p>
                <span className='prompt'>{terminal.workingDirectory} ${' '}</span>
                <span className='before'></span>
                <span className='cursor blink'>&nbsp;</span>
                <span className='after'></span>
            </p>
        </div>
    </div>
};

Terminal.propTypes = {
    terminal: PropTypes.object.isRequired
};

export default Terminal;
