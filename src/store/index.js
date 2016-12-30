import {
  createStore,
  applyMiddleware
} from 'redux';

import createLogger from 'redux-logger';
import rootReducer from '../reducers';
import {routerMiddleware} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import {hashHistory} from 'react-router';
import sagas from '../sagas/index';
const reduxRouterMiddleware = routerMiddleware(hashHistory);
const logger = createLogger();
// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

let store = createStore(
  rootReducer,
  applyMiddleware(
    reduxRouterMiddleware,
    sagaMiddleware,
    logger
  )
);

// then run the saga
sagaMiddleware.run(sagas);

export default store;
