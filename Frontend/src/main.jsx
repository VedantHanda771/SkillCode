import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './store'; // Import the Redux store
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap the App with the Redux Provider */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
