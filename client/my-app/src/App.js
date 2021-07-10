import './App.css';
import './index.js'
import React from "react";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import SandboxPage from './sandox';
import ApolloFetchSandboxPage from './apolloFetchSandbox';
import ApolloMutateSandboxPage from './apolloMutateSandbox';
import TopPage from './top';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={TopPage} />
          <Route exact path="/fetch" component={ApolloFetchSandboxPage} />
          <Route exact path="/mutate" component={ApolloMutateSandboxPage} />
          <Route exact path="/sandbox" component={SandboxPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
