import {createStore, combineReducers, applyMiddleware} from 'redux';
import * as home from './home/reducer';
import * as mine from './mine/reducer';
import thunk from 'redux-thunk';

let store = createStore(
  combineReducers({...home, ...mine}),
  applyMiddleware(thunk)
);

export default store;
