// src/pages/Overview.jsx
import { useState, useEffect } from 'react';
import StatCard from '../components/ui/StatCard';
import PotsWidget from '../components/shared/PotsWidget';
import LatestTransactions from '../components/shared/LatestTransactions';
import BudgetsWidget from '../components/shared/BudgetsWidget';
import RecurringBillsWidget from '../components/shared/RecurringBillsWidget';
import Loading from '../components/ui/Loading';
import { financialService } from '../services/financialService';

export default function Overview({ setActiveTab }) {
  const [summary, setSummary] = useState({ currentBalance: 0, income: 0, expenses: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await financialService.getBalanceSummary();
        setSummary(data);
      } catch (error) {
        console.error('Error loading summary:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return <Loading message="Preparando seu painel financeiro..." />;
  }

  return (
    <div className="space-y-8">
      {/* Cards de Topo */}
      <div className="flex flex-col md:flex-row gap-6">
        <StatCard label="Current Balance" value={summary.income + summary.expenses} variant="dark" />
        <StatCard label="Income" value={summary.income} />
        <StatCard label="Expenses" value={summary.expenses} />
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Coluna Esquerda: 60% */}
        <div className="lg:col-span-3 space-y-8">
          <PotsWidget setActiveTab={setActiveTab} />
          <LatestTransactions setActiveTab={setActiveTab} />
        </div>

        {/* Coluna Direita: 40% */}
        <div className="lg:col-span-2 space-y-8">
          <BudgetsWidget setActiveTab={setActiveTab} />
          <RecurringBillsWidget setActiveTab={setActiveTab} />
        </div>

      </div>
    </div>
  );
}