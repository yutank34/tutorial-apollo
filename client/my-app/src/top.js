import React from 'react';
import './App.css';
import './index.js';
import { Link } from 'react-router-dom';


function TopPage() {
    return (
        <div>
            <div>Top!</div>
            <ul>
                <li>
                    <Link to={`/fetch`}>Go to FetchSandbox</Link>
                </li>
                <li>
                    <Link to={`/mutate`}>Go to MutateSandbox</Link>
                </li>
                <li>
                    <Link to={`/sandbox`}>Go to Sandbox</Link>
                </li>
            </ul>
        </div>
    )
}

export default TopPage;