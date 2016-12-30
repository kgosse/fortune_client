import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {connect} from 'react-redux';
import App from './containers/App/App';

export default (
  <Route path='/' component={connect()(App)}>
{/*    <IndexRoute component={Reporting}/>
    <Route path='purchase' component={Purchase} />*/}
  </Route>
);

