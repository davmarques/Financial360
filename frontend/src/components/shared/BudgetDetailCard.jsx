// src/components/shared/BudgetDetailCard.jsx
import { Card } from "../ui/Card";
import { useState } from "react";
import BudgetMenu from "../budgets/BudgetMenu";

export default function BudgetDetailCard({ budget, onAction, setActiveTab }) {
  const remaining = Math.max(0, budget.limit - budget.spent);
  const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Card className="p-8 bg-white">
      {/* Header do Card */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: budget.color }} />
          <h3 className="text-xl font-bold">{budget.category}</h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-grey-300 hover:text-grey-900 p-1"
          >
            •••
          </button>

          {isMenuOpen && (
            <BudgetMenu 
              onEdit={() => { setIsMenuOpen(false); onAction('edit', budget); }}
              onDelete={() => { setIsMenuOpen(false); onAction('delete', budget); }}
            />
          )}
        </div>
      </div>

      <p className="text-sm text-grey-500 mb-4">Maximum of ${budget.limit.toFixed(2)}</p>

      {/* Barra de Progresso */}
      <div className="w-full bg-beige-100 h-8 rounded-lg p-1 mb-6">
        <div
          className="h-full rounded-md transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: budget.color }}
        />
      </div>

      {/* Grid de Valores (Spent / Remaining) */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border-l-4 pl-4" style={{ borderColor: budget.color }}>
          <p className="text-xs text-grey-500">Spent</p>
          <p className="font-bold">${budget.spent.toFixed(2)}</p>
        </div>
        <div className="border-l-4 border-beige-500 pl-4">
          <p className="text-xs text-grey-500">Remaining</p>
          <p className="font-bold">${remaining.toFixed(2)}</p>
        </div>
      </div>

      {/* Mini lista de transações (Latest Spending) */}
      <div className="bg-beige-100 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-sm">Latest Spending</h4>
          <button onClick={() => setActiveTab('Transactions')} className="text-xs text-grey-500">See All ›</button>
        </div>
        {/* Transações reais filtradas no service */}
        <div className="space-y-3">
          {budget.latestTransactions?.length > 0 ? (
            budget.latestTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="font-bold">{transaction.recipient_sender}</span>
                <div className="text-right">
                  <p className="font-bold">-${Math.abs(transaction.amount).toFixed(2)}</p>
                  <p className="text-grey-500">
                    {new Date(transaction.date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-grey-500 text-center py-2">No transactions yet</p>
          )}
        </div>
      </div>
    </Card>
  );
}