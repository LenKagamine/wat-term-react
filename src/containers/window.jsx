import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Terminal from './terminal.jsx';

const Window = ({ window, selected, onClick }) => {
    return (
        <div className='window-box' onClick={() => onClick(window.id)} style={{
            width: window.width + '%',
            height: window.height + '%',
            left: window.x + '%',
            top: window.y + '%'
        }}>
            <div className={'window' + (selected ? ' selected' : ' ')}>
                <Terminal terminal={window.terminal} selected={selected}/>
            </div>
            <div className='window-info'>
                <span>{window.id}</span>
                <span style={{ float: 'right' }}>
                    {window.x}, {window.y}, {window.width}, {window.height}
                </span>
            </div>
        </div>
    );
};

Window.propTypes = {
    window: PropTypes.object.isRequired,
    selected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        onClick: id => {
            dispatch({
                type: 'SELECT_WINDOW',
                id: id
            })
        }
    }
}

export default connect(null, mapDispatchToProps)(Window);
