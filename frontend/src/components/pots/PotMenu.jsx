// src/components/pots/PotMenu.jsx
import { useEffect, useRef } from 'react';

export default function PotMenu({ onEdit, onDelete, onClose }) {
  const menuRef = useRef(null);

  // Fechar ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef} 
      className="absolute right-6 top-14 mt-2 bg-white rounded-lg shadow-xl w-36 py-2 z-10 border border-gray-100 animate-fadeIn"
    >
      <button onClick={onEdit} className="w-full text-left px-5 py-2 text-sm text-grey-900 hover:bg-gray-50 transition-colors">
        Edit Pot
      </button>
      <div className="border-b border-gray-100 my-1 mx-5" />
      <button onClick={onDelete} className="w-full text-left px-5 py-2 text-sm text-red hover:bg-gray-50 transition-colors">
        Delete Pot
      </button>
    </div>
  );
}