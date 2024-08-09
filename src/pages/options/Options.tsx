console.log('[options/Options] - Options component loaded');

import '../../styles/tailwind.css';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Save, Eye, EyeOff } from 'lucide-react';

const Options = () => {
    console.log('[options/Options] - Options component rendered');
    const [apiKey, setApiKey] = useState('');
    const [showApiKey, setShowApiKey] = useState(false);
    const [saveConfirmation, setSaveConfirmation] = useState('');
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const timeoutRef = useRef<number | NodeJS.Timeout | null>(null);

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
            console.log('[options/Options] - API key saved');
            setSaveConfirmation('API key saved successfully!');
            setIsConfirmationVisible(true);
            setTimeout(() => {
                setIsConfirmationVisible(false);
            }, 2000); // Clear message after 2 seconds
        });
    };

    const toggleApiKeyVisibility = () => {
        setShowApiKey((prev) => !prev);
    };

    const handleFocus = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShowApiKey(true);
    };

    const handleBlur = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            setShowApiKey(false);
        }, 100);
    };

    const handleApiKeyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setApiKey(newValue);
        setShowApiKey(true);
    }, []);

    return (
        <div id="snc-options-container" className="w-full max-w-md mx-auto mt-8 p-6 bg-[#222325] text-white rounded-lg shadow-lg">
            <h1 id="snc-options-title" className="text-2xl font-bold mb-6 text-[#ED7084]">
                Supernotes Web Clipper Options
            </h1>
            <div id="snc-api-key-container" className="mb-4">
                <label htmlFor="apiKey" className="block text-sm font-medium mb-2">
                    Supernotes API Key
                </label>
                <div className="relative">
                    <input
                        type={showApiKey ? 'text' : 'password'}
                        id="snc-api-key-input"
                        value={apiKey}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={handleApiKeyChange}
                        className="w-full bg-[#2c2d30] p-3 pr-10 rounded-md text-white text-base"
                        placeholder="Enter your Supernotes API key"
                    />
                    <button
                        id="snc-api-key-toggle"
                        onClick={toggleApiKeyVisibility}
                        onMouseDown={(e) => e.preventDefault()} // Prevent blur event
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    >
                        {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>
            <button
                id="snc-save-button"
                onClick={handleSave}
                className="flex items-center bg-[#ED7084] hover:bg-[#d55f73] text-white font-bold py-3 px-6 rounded text-base mb-4"
            >
                <Save size={20} className="mr-2" />
                Save
            </button>
            {saveConfirmation && (
                <div
                    id="snc-save-confirmation"
                    className={`mt-4 p-2 bg-green-500 text-white rounded transition-all duration-300 ease-in-out ${
                        isConfirmationVisible ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0 overflow-hidden'
                    }`}
                >
                    {saveConfirmation}
                </div>
            )}
        </div>
    );
};

export default Options;
