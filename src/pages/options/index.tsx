console.log('[options/index] - Options page loaded');

import React from 'react';
import { createRoot } from 'react-dom/client';
import Options from './Options';

const container = document.getElementById('root');
if (container) {
    console.log('[options/index] - Root container found in HTML');
    const root = createRoot(container);

    root.render(
        <React.StrictMode>
            <Options />
        </React.StrictMode>
    );
} else {
    console.error('[options/index] - Root container not found in HTML');
}