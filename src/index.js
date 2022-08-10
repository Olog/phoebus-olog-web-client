import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.js';
import './css/olog.css';
import './css/bootstrap.css';

const container = document.getElementById('root');
const root = createRoot(container); 
root.render(<App />);
