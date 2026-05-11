import CustomSelect from '../ui/CustomSelect';
import { useState } from 'react';

const categories = ['Entertainment', 'Bills', 'Groceries', 'Dining Out', 'Transportation', 'Personal Care', 'Education', 'Lifestyle'];

const themes = [
    { name: 'Green', color: '#277C78', used: true },
    { name: 'Yellow', color: '#F2CDAC', used: true },
    { name: 'Cyan', color: '#82C9D7', used: true },
    { name: 'Navy', color: '#626070', used: false },
    { name: 'Red', color: '#C94736', used: false },
];

export default function BudgetModal({ isOpen, onClose, type, budgetData, onConfirm }) {
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedTheme, setSelectedTheme] = useState(themes[3]);
    const [spend, setSpend] = useState(budgetData?.limit || '');

    // Efeito para resetar/carregar dados quando o modal abre ou muda de tipo
    useState(() => {
        if (budgetData) {
            setSelectedCategory(budgetData.category);
            setSpend(budgetData.limit);
            const theme = themes.find(t => t.color === budgetData.color) || themes[3];
            setSelectedTheme(theme);
        }
    }, [budgetData, isOpen]);

    const isDelete = type === 'delete';
    const isEdit = type === 'edit';

    // Definição dinâmica de textos baseada nos seus prints
    const modalTitle = isDelete
        ? `Delete ‘${budgetData?.category}’?`
        : isEdit ? 'Edit Budget' : 'Add New Budget';

    const modalDesc = isDelete
        ? 'Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever.'
        : isEdit
            ? 'As your budgets change, feel free to update your spending limits.'
            : 'Choose a category to set a spending budget. These categories can help you monitor spending.';

    const confirmBtnText = isDelete
        ? 'Yes, Confirm Deletion'
        : isEdit ? 'Save Changes' : 'Add Budget';

    const confirmBtnClass = isDelete
        ? 'bg-[#C94736] hover:bg-opacity-90'
        : 'bg-[#201F24] hover:bg-opacity-90';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center m-0 p-4">
            <div
                className="fixed inset-0 bg-black/50 w-full h-full animate-fadeIn"
                onClick={onClose}
            />

            <div className="bg-white rounded-xl w-full max-w-lg p-8 md:p-10 relative z-10 animate-modalEnter">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-grey-900">{modalTitle}</h2>
                    <button onClick={onClose} className="text-grey-500 hover:text-grey-900 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.8333 5.34167L14.6583 4.16667L10 8.825L5.34167 4.16667L4.16667 5.34167L8.825 10L4.16667 14.6583L5.34167 15.8333L10 11.175L14.6583 15.8333L15.8333 14.6583L11.175 10L15.8333 5.34167Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-grey-500 leading-relaxed mb-8">
                    {modalDesc}
                </p>

                {!isDelete && (
                    <div className="space-y-6 mb-8">
                        <CustomSelect
                            label="Budget Category"
                            options={categories}
                            selected={selectedCategory}
                            onSelect={setSelectedCategory}
                            direction="down"
                        />

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-grey-500">Maximum Spend</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-300">$</span>
                                <input
                                    type="number"
                                    value={spend}
                                    onChange={(e) => setSpend(e.target.value)}
                                    placeholder="e.g. 2000"
                                    className="w-full pl-8 pr-4 py-3 border border-beige-500 rounded-lg outline-none focus:border-grey-900"
                                />
                            </div>
                        </div>

                        <CustomSelect
                            label="Theme"
                            type="color"
                            options={themes}
                            selected={selectedTheme}
                            onSelect={setSelectedTheme}
                        />
                    </div>
                )}

                <div className="space-y-4">
                    <button
                        onClick={() => onConfirm({ 
                            id: budgetData?.id, 
                            type, 
                            category: selectedCategory, 
                            limit: parseFloat(spend), 
                            color: selectedTheme.color 
                        })}
                        className={`w-full text-white py-4 rounded-lg font-bold transition-all shadow-sm ${confirmBtnClass}`}
                    >
                        {confirmBtnText}
                    </button>
                    
                    {isDelete && (
                        <button
                            onClick={onClose}
                            className="w-full text-grey-500 py-2 text-sm font-bold hover:text-grey-900 transition-colors"
                        >
                            No, Go Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}