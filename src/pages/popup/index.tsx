// popup/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Save, Settings, X } from 'lucide-react';
import '../../styles/tailwind.css';
import { GET_TAB_INFO, GET_TAB_INFO_RESPONSE } from '../../common/actions';

const Popup = () => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState('');
    const [favicon, setFavicon] = useState('');
    const [desc, setDesc] = useState('');
    const notesRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        console.log('[pages/popup] - useEffect()');

        const handleMessage = (event: MessageEvent) => {
            console.log('[pages/popup] - Received message:', event);

            if (event.data.action === GET_TAB_INFO_RESPONSE) {
                console.log('[pages/popup] - Received GET_TAB_INFO_RESPONSE message:', event.data);
                const { title, url, description } = event.data;
                setTitle(title || '');
                const urlObject = new URL(url || '');
                setUrl(urlObject.hostname);
                setFavicon(`https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`);
                setDesc(description || '');
            } else {
                console.log('[pages/popup] - Ignored message:', event.data);
            }
        };

        // Listen for messages from the content script
        console.log('[pages/popup] - Adding event listener', {
            window: window,
            windowActiveElement: window.document.activeElement,
            windowParent: window.parent,
            windowParentActiveElement: window.parent.document.activeElement,
        });

        // TODO: for some reason, this "window" is not iframe's window, but the parent window
        window.addEventListener('message', handleMessage);

        // Request tab info from content script
        window.parent.postMessage({ action: GET_TAB_INFO }, '*');

        // Auto-focus on the notes text field
        if (notesRef.current) {
            notesRef.current.focus();
        }

        return () => {
            console.log('[pages/popup] - Cleanup');
            window.removeEventListener('message', handleMessage); // remove the event listener on unmount
        };
    }, []);
    const handleCapture = () => {
        console.log('[pages/popup] #handleCapture() - Captured: ', { title, url, notes, tags });
    };
    
    const handleCancel = () => {
        throw new Error('Function not implemented.');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            handleCapture();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    return (
        <div
            id="snc-popup"
            className="w-[375px] bg-[#222325] text-white p-6 rounded-lg shadow-lg text-base flex flex-col h-full"
            onKeyDown={handleKeyDown}
        >
            <div id="snc-header" className="flex justify-between items-center mb-4">
                <div id="snc-title" className="text-[#ED7084] font-bold text-xl">
                    SN Web Clipper
                </div>
                <button id="snc-settings" className="text-gray-400 hover:text-white">
                    <Settings size={20} />
                </button>
            </div>
            <div className="flex-grow flex flex-col space-y-4 overflow-hidden">
                <div id="snc-preview" className="bg-[#2c2d30] p-4 rounded-md flex-shrink-0">
                    <div className="flex items-center">
                        <div
                            id="snc-favicon"
                            className="w-10 h-10 bg-black rounded-md flex items-center justify-center mr-4 overflow-hidden"
                        >
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
                    <div id="snc-description">
                        <p className="text-white text-sm line-clamp-2">{desc}</p>
                    </div>
                </div>

                <div id="snc-notes" className="flex-grow min-h-0">
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

                <div id="snc-tags" className="mb-6 flex-shrink-0">
                    <input
                        id="snc-tags-input"
                        type="text"
                        placeholder="Add Tags"
                        className="w-full bg-[#2c2d30] p-3 rounded-md text-white text-base"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>
            </div>
            <div id="snc-actions" className="flex justify-between items-center mt-4">
                <button
                    id="snc-cancel"
                    className="flex items-center text-gray-400 hover:text-white font-bold py-2 px-4 rounded"
                    onClick={handleCancel}
                    title="Cancel (Esc)"
                >
                    {/* <X size={20} className="mr-2" /> */}
                    Cancel
                    <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded">Esc</span>
                </button>
                <button
                    id="snc-capture"
                    className="flex items-center bg-[#ED7084] hover:bg-[#d55f73] text-white font-bold py-2 px-4 rounded"
                    onClick={handleCapture}
                    title="Capture (CMD+Enter)"
                >
                    {/* <Save size={20} className="mr-2" /> */}
                    Capture
                    <span className="ml-2 text-xs bg-white bg-opacity-20 px-1.5 py-0.5 rounded">⌘+Enter</span>
                </button>
            </div>
        </div>
    );
};

export default Popup;
