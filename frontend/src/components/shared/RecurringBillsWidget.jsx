import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { financialService } from "../../services/financialService";

export default function RecurringBillsWidget({ setActiveTab }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBills() {
      try {
        const data = await financialService.getRecurringBills();
        setBills(data);
      } catch (error) {
        console.error("Error loading bills:", error);
      } finally {
        setLoading(false);
      }
    }
    loadBills();
  }, []);

  if (loading) return <Card className="bg-white p-6">Loading bills...</Card>;

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold">Recurring Bills</h2>
        <button 
          onClick={() => setActiveTab('Recurring Bills')}
          className="text-sm text-grey-500 hover:underline cursor-pointer"
        >
          See Details ›
        </button>
      </div>

      <div className="space-y-4">
        {bills.map((bill) => (
          <div 
            key={bill.label} 
            className={`flex justify-between items-center p-4 bg-beige-100 rounded-xl border-l-4 ${bill.color}`}
          >
            <span className="text-sm text-grey-500">{bill.label}</span>
            <span className="text-sm font-bold text-grey-900">${bill.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}