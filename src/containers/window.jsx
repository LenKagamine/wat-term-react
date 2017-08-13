import React from 'react';
import PropTypes from 'prop-types';

import Terminal from './terminal.jsx';

const Window = ({ window }) => {
    return <div className='window-box' style={{
        width: window.width + '%',
        height: window.height + '%',
        left: window.x + '%',
        top: window.y + '%'
    }}>
        <div className='window'>
            <Terminal terminal={window.terminal}/>
        </div>
        <div className='window-info'>
            <span>{window.id}</span>
            <span style={{ float: 'right' }}>
                {window.x}, {window.y}, {window.width}, {window.height}
            </span>
        </div>
    </div>
};

Window.propTypes = {
    window: PropTypes.object.isRequired
};

export default Window;
