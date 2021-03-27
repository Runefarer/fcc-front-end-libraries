import React from 'react';
import ReactDOM from 'react-dom';
import hljs from 'highlight.js';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

hljs.initHighlightingOnLoad();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
