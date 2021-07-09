import logo from './logo.svg';
import './App.css';
import './index.js'
import { useState } from "react";
import React from "react";
import { Link, BrowserRouter, Route, Switch } from 'react-router-dom';
import {
  useQuery,
  gql
} from "@apollo/client";
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
