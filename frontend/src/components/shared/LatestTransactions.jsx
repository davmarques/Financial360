import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import Loading from "../ui/Loading";
import { financialService } from "../../services/financialService";

export default function LatestTransactions({setActiveTab}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await financialService.getTransactions(5);
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  if (loading) return (
    <Card className="bg-white p-6">
      <Loading message="Carregando transações..." />
    </Card>
  );

  return (
    <Card className="flex flex-col bg-white">
      {/* Header do Card */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-grey-900">Transactions</h2>
        <button 
          onClick={() => setActiveTab('Transactions')}
          className="text-sm text-grey-500 hover:underline cursor-pointer"
        >
          View All ›
        </button>
      </div>

      {/* Lista de Transações */}
      <div className="flex flex-col flex-1 divide-y divide-[#F2F2F2]">
        {transactions.map((transaction, index) => (
          <div 
            key={transaction.id} 
            className={`flex justify-between items-center py-4 ${index === 0 ? 'pt-0' : ''} ${index === transactions.length - 1 ? 'pb-0' : ''}`}
          >
            {/* Esquerda: Avatar e Nome */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-grey-100 overflow-hidden flex items-center justify-center bg-orange/20 text-orange font-bold uppercase">
                {transaction.recipient_sender.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-grey-900">{transaction.recipient_sender}</p>
                <p className="text-xs text-grey-500">{new Date(transaction.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Direita: Valor formatado */}
            <div className="text-right">
              <p className={`text-sm font-bold ${transaction.amount > 0 ? 'text-green' : 'text-grey-900'}`}>
                {transaction.amount > 0 ? '+' : ''}${parseFloat(transaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}