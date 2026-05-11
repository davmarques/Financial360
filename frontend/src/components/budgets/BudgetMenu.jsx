// src/components/ui/ActionMenu.jsx
export default function BudgetMenu({ onEdit, onDelete, type = "Budget" }) {
  return (
    <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] py-2 z-50 animate-fadeIn border border-gray-50">
      <button 
        onClick={onEdit}
        className="w-full text-left px-5 py-3 text-sm text-[#201F24] hover:bg-[#F8F4F0] transition-colors"
      >
        Edit {type}
      </button>
      <div className="border-b border-gray-100 mx-5 my-1" />
      <button 
        onClick={onDelete}
        className="w-full text-left px-5 py-3 text-sm text-[#C94736] hover:bg-[#F8F4F0] transition-colors"
      >
        Delete {type}
      </button>
    </div>
  );
}