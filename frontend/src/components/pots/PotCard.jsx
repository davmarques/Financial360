// src/components/shared/PotCard.jsx
import { Card } from "../ui/Card";
import { useState } from "react";
import PotMenu from "./PotMenu";

export default function PotCard({ pot, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const percentage = Math.min((pot.total / pot.target) * 100, 100);

  const handleMenuAction = (type) => {
    setMenuOpen(false);
    onAction(type, pot); // Passa o tipo (edit/delete) e o pot para a página pai
  };

  return (
    <Card className="bg-white p-6 relative flex flex-col justify-between">
      {/* 1. Header: Nome e Menu */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pot.color }} />
          <h3 className="text-xl font-bold text-grey-900">{pot.name}</h3>
        </div>
        <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="text-grey-300 hover:text-grey-900 p-1"
          >
            •••
          </button>
          
          {/* Menu Flutuante (image_8) */}
          {menuOpen && (
            <PotMenu 
              onEdit={() => handleMenuAction('edit')} 
              onDelete={() => handleMenuAction('delete')} 
              onClose={() => setMenuOpen(false)}
            />
          )}
      </div>

      {/* 2. Valores Principais (Total Saved) */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-grey-500">Total Saved</p>
        <p className="text-3xl font-bold text-grey-900">
          ${pot.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* 3. Seção de Progresso e Target */}
      <div className="space-y-2 mb-8">
        {/* Barra de Progresso */}
        <div className="w-full bg-beige-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out" 
            style={{ width: `${percentage}%`, backgroundColor: pot.color }}
          />
        </div>
        
        {/* Info de Target e Porcentagem */}
        <div className="flex justify-between text-xs font-bold text-grey-500">
          <span className="text-grey-500">{percentage.toFixed(2)}%</span>
          <span>Target of ${pot.target.toLocaleString()}</span>
        </div>
      </div>

      {/* 4. Botões de Ação */}
      <div className="flex gap-4 mt-auto">
        <button 
          onClick={() => onAction('add', pot)}
          className="flex-1 bg-beige-100 hover:bg-white border border-transparent hover:border-beige-500 py-3 rounded-lg font-bold text-grey-900 transition-all text-sm"
        >
          + Add Money
        </button>
        <button 
          onClick={() => onAction('withdraw', pot)}
          className="flex-1 bg-beige-100 hover:bg-white border border-transparent hover:border-beige-500 py-3 rounded-lg font-bold text-grey-900 transition-all text-sm"
        >
          Withdraw
        </button>
      </div>
    </Card>
  );
}