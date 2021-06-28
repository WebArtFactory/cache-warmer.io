import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';



import Home from './Screens/Home';
import Login from './Screens/Login';

function App() {
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/home' exact component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
