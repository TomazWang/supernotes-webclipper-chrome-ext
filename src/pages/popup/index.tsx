import React from 'react';
import ReactDOM from 'react-dom/client';

const Popup: React.FC = () => {
  return (
    <div>
      <h1>Supernotes Web Clipper</h1>
      <button>Clip Page</button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);