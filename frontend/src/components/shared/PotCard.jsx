// src/components/shared/PotCard.jsx
import { Card } from "../ui/Card";

export default function PotCard({ pot }) {
  const percentage = Math.min((pot.total / pot.target) * 100, 100);

  return (
    <Card className="p-6 bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pot.color }} />
          <h3 className="text-xl font-bold text-grey-900">{pot.name}</h3>
        </div>
        <button className="text-grey-300 hover:text-grey-900 transition-colors">•••</button>
      </div>

      {/* Valores */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-grey-500">Total Saved</p>
        <p className="text-3xl font-bold text-grey-900">${pot.total.toFixed(2)}</p>
      </div>

      {/* Barra de Progresso Customizada */}
      <div className="space-y-2 mb-8">
        <div className="w-full bg-beige-100 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700" 
            style={{ width: `${percentage}%`, backgroundColor: pot.color }}
          />
        </div>
        <div className="flex justify-between text-xs font-bold text-grey-500">
          <span>{percentage.toFixed(2)}%</span>
          <span>Target of ${pot.target}</span>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex gap-4">
        <button className="flex-1 bg-beige-100 hover:bg-white border border-transparent hover:border-beige-500 py-3 rounded-lg font-bold text-grey-900 transition-all">
          + Add Money
        </button>
        <button className="flex-1 bg-beige-100 hover:bg-white border border-transparent hover:border-beige-500 py-3 rounded-lg font-bold text-grey-900 transition-all">
          Withdraw
        </button>
      </div>
    </Card>
  );
}