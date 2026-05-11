// src/components/ui/CustomSelect.jsx
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({ label, options, selected, onSelect, type = 'text', direction = 'up' }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            <label className="text-xs font-bold text-grey-500">{label}</label>

            {/* Trigger do Botão */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-4 py-3 border border-beige-500 rounded-lg bg-white outline-none focus:border-grey-900 transition-all"
            >
                <div className="flex items-center gap-3">
                    {type === 'color' && (
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selected.color }} />
                    )}
                    <span className="text-sm text-grey-900">{selected.name || selected}</span>
                </div>
                <ChevronDown className={`text-grey-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} size={20} />
            </button>

            {/* Dropdown Menu (image_10 e image_11) */}
            {isOpen && (
                <div className={`absolute left-0 w-full bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[10001] max-h-60 overflow-y-auto animate-fadeIn ${
                    direction === 'up' ? 'bottom-[calc(100%+2px)]' : 'top-[calc(100%+8px)]'
                }`}>
                    {options.map((option, index) => {
                        const isColor = type === 'color';
                        const isUsed = isColor && option.used;
                        const optionName = isColor ? option.name : option;

                        return (
                            <button
                                key={index}
                                disabled={isUsed}
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex justify-between items-center px-5 py-3 text-sm transition-colors border-b border-gray-50 last:border-0 ${isUsed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-beige-100 text-grey-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isColor && (
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: option.color }} />
                                    )}
                                    <span className={isUsed ? 'text-grey-500' : ''}>{optionName}</span>
                                </div>
                                {isUsed && <span className="text-xs text-grey-500">Already used</span>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}