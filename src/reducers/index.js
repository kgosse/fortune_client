import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import movies from './movies.js';

let rootReducer = combineReducers({
  movies,
  routing
});

export default rootReducer;

