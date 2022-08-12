import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.js';
import { store } from './store.js';
import { Provider } from 'react-redux';
import './css/olog.css';
import './css/bootstrap.css';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(
    <Provider store={store} >
        <App />
    </Provider>
);
