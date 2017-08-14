import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Window from './window.jsx';

const Workspace = ({ workspace, currentWindowId }) => {
    var windows = [];
    for(var i = 0; i < workspace.windows.length; i++) {
        windows.push(<Window key={i} window={workspace.windows[i]} selected={workspace.windows[i].id === currentWindowId}/>);
    }
    return (
        <div className='workspace'>
            {windows}
        </div>
    );
};

Workspace.propTypes = {
    workspace: PropTypes.object.isRequired,
    currentWindowId: PropTypes.number.isRequired
};

const mapStateToProps = state => {
    return {
        currentWindowId: state.selectedWindow
    }
};

export default connect(mapStateToProps)(Workspace);
