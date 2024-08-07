import React, { useState, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import '../../styles/tailwind.css';

const Popup = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState('');

    useEffect(() => {
        console.log('[pages/popup] - useEffect()');
        chrome.runtime.sendMessage({ action: 'GET_TAB_INFO' }, (response) => {
            if (response) {
                console.log('[pages/popup] #useEffect() - Tab info:', response);
                setTitle(response.title || '');
                setUrl(new URL(response.url || '').hostname);
            } else {
                console.error('[pages/popup] #useEffect() - Failed to get tab info');
            }
        });
    }, []);

    const handleCapture = () => {
        console.log('[pages/popup] #handleCapture() - Captured: ', { title, url, notes, tags });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleCapture();
        }
    };

    return (
        <div id="popup" className="w-[373px] bg-[#222325] text-white p-4 rounded-lg shadow-lg" onKeyDown={handleKeyDown}>
            <div className="flex justify-between items-center mb-4">
                <div className="text-[#ED7084] font-bold">SN Web Clipper</div>
                <button className="text-gray-400 hover:text-white">Remove</button>
            </div>

            <div className="bg-[#2c2d30] p-3 rounded-md mb-4">
                <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center mr-3">
                        <span className="text-xs font-bold">SN</span>
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm">{title}</h2>
                        <p className="text-xs text-gray-400">{url}</p>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <textarea
                    placeholder="Add Notes"
                    className="w-full bg-[#2c2d30] p-2 rounded-md text-white text-sm resize-none"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Add Tags"
                    className="w-full bg-[#2c2d30] p-2 rounded-md text-white text-sm"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center">
                <button
                    className="flex items-center bg-[#ED7084] hover:bg-[#d55f73] text-white font-bold py-2 px-4 rounded"
                    onClick={handleCapture}
                    title="Capture (CMD+Enter)"
                >
                    <Save size={18} className="mr-2" />
                    Capture
                </button>
                <button className="text-gray-400 hover:text-white">
                    <Settings size={18} />
                </button>
            </div>
        </div>
    );
};

export default Popup;
