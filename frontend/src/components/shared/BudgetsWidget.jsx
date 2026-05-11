import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card } from "../ui/Card";
import { financialService } from "../../services/financialService";

export default function BudgetsWidget({ setActiveTab }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBudgets() {
      try {
        const data = await financialService.getBudgets();
        setBudgets(data);
      } catch (error) {
        console.error("Error loading budgets:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBudgets();
  }, []);

  const totalSpent = budgets.reduce((acc, b) => acc + b.spent, 0);
  const totalLimit = budgets.reduce((acc, b) => acc + parseFloat(b.amount_limit), 0);

  if (loading) return <Card className="bg-white p-6">Loading budgets...</Card>;

  return (
    <Card className='bg-white'>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Budgets</h2>
        <button 
          onClick={() => setActiveTab('Budgets')}
          className="text-sm text-grey-500 hover:underline cursor-pointer"
        >
          See Details ›
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Gráfico Donut */}
        <div className="relative w-full h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={budgets}
                innerRadius={60}
                outerRadius={75}
                paddingAngle={0}
                dataKey="spent"
                nameKey="category"
                stroke="none"
              >
                {budgets.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Texto Central do Gráfico */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-3xl font-bold text-grey-900">${Math.round(totalSpent).toLocaleString()}</span>
            <span className="text-xs text-grey-500 italic">of ${Math.round(totalLimit).toLocaleString()} limit</span>
          </div>
        </div>

        {/* Legenda Lateral */}
        <div className="flex flex-col gap-4 w-full sm:w-auto min-w-[120px]">
          {budgets.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-l-4 pl-4 py-1" style={{ borderColor: item.color }}>
              <div>
                <p className="text-xs text-grey-500">{item.category}</p>
                <p className="text-sm font-bold text-grey-900">${parseFloat(item.spent).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}