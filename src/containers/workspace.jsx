import React from 'react';
import PropTypes from 'prop-types';

import Window from './window.jsx';

const Workspace = ({ workspace }) => {
    var windows = [];
    for(var i = 0; i < workspace.windows.length; i++) {
        windows.push(<Window key={i} window={workspace.windows[i]}/>);
    }
    return <div className='workspace'>
        {windows}
    </div>
};

Workspace.propTypes = {
    workspace: PropTypes.object.isRequired
};

export default Workspace;
