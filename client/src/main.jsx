import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async'; // Isko import karein
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider> {/* App ko isse wrap karein */}
    <Router>
      <App />
    </Router>
    </HelmetProvider>
  </StrictMode>,
);