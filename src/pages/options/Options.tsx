console.log('[options/Options] - Options component loaded');

import '../../styles/tailwind.css';

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const Options = () => {
    console.log('[options/Options] - Options component rendered');
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        // Load saved API key when component mounts
        chrome.storage.sync.get(['apiKey'], (result) => {
            if (result.apiKey) {
                setApiKey(result.apiKey);
            }
        });
    }, []);

    const handleSave = () => {
        chrome.storage.sync.set({ apiKey }, () => {
            console.log('API key saved');
            // You can add a success message here
            
        });
    };

    return (
        <div className="w-full max-w-md mx-auto mt-8 p-6 bg-[#222325] text-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-[#ED7084]">Supernotes Capture Options</h1>
            <div className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                    Supernotes API Key
                </label>
                <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full bg-[#2c2d30] p-3 rounded-md text-white text-base"
                    placeholder="Enter your Supernotes API key"
                />
            </div>
            <button
                onClick={handleSave}
                className="flex items-center bg-[#ED7084] hover:bg-[#d55f73] text-white font-bold py-3 px-6 rounded text-base"
            >
                <Save size={20} className="mr-2" />
                Save
            </button>
        </div>
    );
};

export default Options;
