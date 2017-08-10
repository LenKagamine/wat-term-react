// import { combineReducers } from 'redux';

// import { combineReducers } from 'redux'
// import * as reducers from './reducers'
//
// const todoApp = combineReducers(reducers)

const rootReducer = function (state = {}, action) {
    console.log(action);
    switch(action.type) {
        default:
            return state;
    }
}

export default rootReducer;
