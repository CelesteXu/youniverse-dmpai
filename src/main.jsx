import React from 'react';
import { createRoot } from 'react-dom/client';
import TravelerPage from './traveler/TravelerPage.jsx';
import './styles.css';

document.documentElement.dataset.experience = 'traveler';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TravelerPage />
  </React.StrictMode>,
);
