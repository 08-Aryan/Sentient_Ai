import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface InputAreaProps {
    onSendMessage: (text: string) => void;
    disabled: boolean;
    placeholder: string;
}

const InputArea: React.FC<InputAreaProps> = ({ onSendMessage, disabled, placeholder }) => {
    const [inputText, setInputText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText);
            setInputText('');
        }
    };

    return (
        <footer className="flex-shrink-0 p-4 md:p-6 backdrop-blur-md bg-black/80 border-t border-gray-800/50 z-20">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="relative flex items-center group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full bg-gray-900/50 text-white placeholder-gray-600 rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-sky-600/50 focus:bg-gray-900 border border-gray-800/50 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || disabled}
                        className="absolute right-2 p-2.5 bg-sky-600 text-white rounded-xl hover:bg-sky-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-600/20"
                    >
                        <Send size={18} />
                    </button>
                </form>
                <div className="flex justify-center gap-6 mt-3 opacity-60">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
                        <span className="text-[10px] text-gray-500">Positive Context</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                        <span className="text-[10px] text-gray-500">Negative Context</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default InputArea;
