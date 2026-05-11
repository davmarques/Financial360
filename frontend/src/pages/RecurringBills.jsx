import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Search } from "lucide-react";
import Loading from "../components/ui/Loading";
import { financialService } from "../services/financialService";

export default function RecurringBills() {
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [billsData, summaryData] = await Promise.all([
          financialService.getTransactions(100),
          financialService.getRecurringBills()
        ]);
        
        const recurringOnly = billsData.filter(t => t.recurring);
        setBills(recurringOnly);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error loading recurring bills:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBills = bills.filter(b => 
    b.recipient_sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = bills.reduce((acc, b) => acc + Math.abs(parseFloat(b.amount)), 0);

  if (loading) return <Loading message="Carregando suas contas recorrentes..." />;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-grey-900">Recurring Bills</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-grey-900 text-white p-6">
            <div className="flex flex-row items-center mb-2 gap-1 text-4xl">
              <span>🧾</span>
              <div>
                <p className="text-sm font-normal opacity-70">Total Bills</p>
                <p className="text-4xl font-bold">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <h3 className="font-bold mb-5 text-grey-900">Summary</h3>
            <div className="space-y-4">
              {summary.map(item => (
                <div key={item.label} className={`flex justify-between text-xs border-b border-gray-100 pb-4 ${item.label === "Due Soon" ? "text-red font-bold" : "text-grey-500"}`}>
                  <span>{item.label}</span>
                  <span className={item.label !== "Due Soon" ? "font-bold text-grey-900" : ""}>
                    ${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="lg:col-span-8 p-6 md:p-8 bg-white text-grey-900">
          <div className="flex justify-between items-center mb-6">
            <div className="relative flex-1 max-w-xs">
              <input 
                type="text" 
                placeholder="Search bill" 
                className="w-full pl-4 pr-10 py-3 border border-beige-500 rounded-lg outline-none focus:border-grey-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-500" size={18} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="hidden md:table-header-group">
                <tr className="text-xs text-grey-500 border-b border-gray-100 text-left">
                  <th className="py-4 font-normal">Bill Title</th>
                  <th className="py-4 font-normal">Due Date</th>
                  <th className="py-4 font-normal text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBills.map((bill) => {
                  const billDate = new Date(bill.date);
                  const isPaid = billDate < new Date();
                  
                  return (
                    <tr key={bill.id} className="text-sm">
                      <td className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange/20 text-orange font-bold flex items-center justify-center uppercase">
                            {bill.recipient_sender.charAt(0)}
                          </div>
                          <span className="font-bold text-grey-900">{bill.recipient_sender}</span>
                        </div>
                      </td>
                      <td className="py-5 text-grey-500">
                        <div className="flex items-center gap-2">
                          Monthly - {billDate.getDate()}th
                          {isPaid && <span className="text-green text-xs bg-green/10 px-1 rounded ml-2">Paid</span>}
                        </div>
                      </td>
                      <td className="py-5 text-right font-bold text-grey-900">
                        ${Math.abs(parseFloat(bill.amount)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}