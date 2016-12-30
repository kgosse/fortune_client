import React from 'react';
import ReactDOM from 'react-dom';

import {Provider} from 'react-redux';
import {Router, hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import store from './store';
import routes from './routes';

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render((
    <Provider store={store}>
      <div>
        <Router history={history}>
          {routes}
        </Router>
      </div>
    </Provider>
  ),
  document.getElementById('root')
);

