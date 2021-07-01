import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';

import Home from './Screens/Home';
import Login from './Screens/Login';

import token from './reducers/token';

const store = createStore(combineReducers({ token }));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route path='/' exact component={Login} />
          <Route path='/home' exact component={Home} />
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
