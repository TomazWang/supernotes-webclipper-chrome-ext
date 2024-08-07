import React, { useState, useEffect, useRef } from 'react';
import { Save, Settings } from 'lucide-react';
import '../../styles/tailwind.css';

const Popup = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState('');
    const [favicon, setFavicon] = useState('');
    const notesRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log('[pages/popup] - useEffect()');

        // Listen for messages from the content script
        window.addEventListener('message', (event) => {
            if (event.data.action === 'GET_TAB_INFO') {
                console.log('[pages/popup] - Received GET_TAB_INFO message:', event.data);
                const { title, url } = event.data;
                setTitle(title || '');
                const urlObject = new URL(url || '');
                setUrl(urlObject.hostname);
                setFavicon(`https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`);
            }
        });

        // Request tab info from content script
        window.parent.postMessage({ action: 'GET_TAB_INFO' }, '*');

        // Auto-focus on the notes text field
        if (notesRef.current) {
            notesRef.current.focus();
        }
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
        <div id="snc-popup" className="w-[375px] bg-[#222325] text-white p-6 rounded-lg shadow-lg text-base" onKeyDown={handleKeyDown}>
            <div id="snc-header" className="flex justify-between items-center mb-6">
                <div id="snc-title" className="text-[#ED7084] font-bold text-xl">
                    SN Web Clipper
                </div>
                <button id="snc-remove" className="text-gray-400 hover:text-white text-base">
                    Remove
                </button>
            </div>

            <div id="snc-preview" className="bg-[#2c2d30] p-4 rounded-md mb-6">
                <div className="flex items-center">
                    <div id="snc-favicon" className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-4 overflow-hidden">
                        {favicon ? (
                            <img src={favicon} alt="Site favicon" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-sm font-bold">SN</span>
                        )}
                    </div>
                    <div>
                        <h2 id="snc-page-title" className="font-semibold text-lg text-[#DDDDDF]">
                            {title}
                        </h2>
                        <p id="snc-page-url" className="text-sm text-gray-400">
                            {url}
                        </p>
                    </div>
                </div>
            </div>

            <div id="snc-notes" className="mb-6">
                <textarea
                    id="snc-notes-input"
                    ref={notesRef}
                    placeholder="Add Notes"
                    className="w-full bg-[#2c2d30] p-3 rounded-md text-white text-base resize-none"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
            </div>

            <div id="snc-tags" className="mb-6">
                <input
                    id="snc-tags-input"
                    type="text"
                    placeholder="Add Tags"
                    className="w-full bg-[#2c2d30] p-3 rounded-md text-white text-base"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                />
            </div>

            <div id="snc-actions" className="flex justify-between items-center">
                <button
                    id="snc-capture"
                    className="flex items-center bg-[#ED7084] hover:bg-[#d55f73] text-white font-bold py-3 px-6 rounded text-base"
                    onClick={handleCapture}
                    title="Capture (CMD+Enter)"
                >
                    <Save size={20} className="mr-2" />
                    Capture
                </button>
                <button id="snc-settings" className="text-gray-400 hover:text-white">
                    <Settings size={20} />
                </button>
            </div>
        </div>
    );
};

export default Popup;
