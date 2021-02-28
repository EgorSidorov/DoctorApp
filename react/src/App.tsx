import React from 'react';
import Record from './components/Record'
import Menu from './components/Menu'
import Schedule from './components/Schedule'
import { HashRouter as Router, Route, Link, Switch,Redirect } from 'react-router-dom'
import { render } from 'react-dom';
import './App.css';

function App() {
    return (
      <Router>
        <div>
          <Menu/>
          <Switch>
            <Route key = "route" exact path="/record" component={Record} />
            <Route key = "schedule" exact path="/schedule" component={Schedule} />
            <Redirect exact from="/" to="/schedule" />     
          </Switch>
        </div>
      </Router>
    );
}

export default App;
