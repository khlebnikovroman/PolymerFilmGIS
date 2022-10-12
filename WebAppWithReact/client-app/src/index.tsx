import React from 'react';
import ReactDOM from 'react-dom/client';
import 'antd/dist/antd.css'
import reportWebVitals from './reportWebVitals';
import Map from "./components/map";
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <App/>
  </React.StrictMode>
);
reportWebVitals();
