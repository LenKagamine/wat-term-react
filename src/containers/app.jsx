import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Workspace from './workspace.jsx';
import BottomBar from './bottombar.jsx';

const App = ({ currentWorkspace, background }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            background
        }}>
            <Workspace workspace={currentWorkspace}/>
            <BottomBar />
        </div>
    );
}

App.propTypes = {
    currentWorkspace: PropTypes.object.isRequired,
    background: PropTypes.string.isRequired
};

const mapStateToProps = state => {
    return {
        currentWorkspace: state.workspaces[state.selectedWorkspace],
        background: state.wsh.env.background
    }
};


export default connect(mapStateToProps)(App);
