import { X, AlertCircle } from 'lucide-react';

export default function ErrorModal({ isOpen, onClose, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center m-0 p-4">
            <div
                className="fixed inset-0 bg-black/50 w-full h-full animate-fadeIn"
                onClick={onClose}
            />

            <div className="bg-white rounded-xl w-full max-w-md p-8 relative z-10 animate-modalEnter shadow-2xl">
                <div className="flex items-start gap-4 mb-6">
                    <div className="bg-red/10 p-3 rounded-full">
                        <AlertCircle className="text-red" size={24} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-grey-900 mb-2">{title || "Action Not Allowed"}</h2>
                        <p className="text-sm text-grey-500 leading-relaxed">
                            {message}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-grey-300 hover:text-grey-900 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="w-full bg-grey-900 text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all"
                >
                    Close
                </button>
            </div>
        </div>
    );
}