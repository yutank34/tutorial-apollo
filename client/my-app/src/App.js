import './App.css';
import './index.js'
import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SandboxPage from './sandox';
import ApolloboxPage from './apolloSandbox';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={ApolloboxPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
