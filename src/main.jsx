
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {DataProvider } from "./Context/DataContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <DataProvider>
    <React.StrictMode>
    <App />
  </React.StrictMode>
  </DataProvider>
);
