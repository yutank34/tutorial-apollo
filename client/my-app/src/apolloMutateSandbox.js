import React from 'react';
import './App.css';
import './index.js';
import { Link } from 'react-router-dom';

function ApolloMutateSandboxPage() {
    return (
        <div>
            <h2>mutate!</h2>
            <Link to={`/`}>Back to TOP</Link>
        </div>
    )
}

export default ApolloMutateSandboxPage;