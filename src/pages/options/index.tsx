import React from 'react';
import ReactDOM from 'react-dom/client';

const Options: React.FC = () => {
  return (
    <div>
      <h1>Supernotes Web Clipper Options</h1>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);