import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Search, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { financialService } from "../services/financialService";
import Loading from "../components/ui/Loading";
import TransactionModal from "../components/transactions/TransactionModal";

export default function Transactions() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Latest");
  const [category, setCategory] = useState("All Transactions");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await financialService.getTransactions(100);
      setAllTransactions(data);
    } catch (error) {
      console.error("Error loading transactions:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleAddTransaction = async (newTransaction) => {
    try {
      await financialService.addTransaction(newTransaction);
      await loadTransactions(); // Recarrega a lista
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Failed to add transaction. Please check if you are logged in correctly.");
    }
  };

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.recipient_sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All Transactions" || t.category === category;
    return matchesSearch && matchesCategory;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "Latest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "Oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "A to Z") return a.recipient_sender.localeCompare(b.recipient_sender);
    if (sortBy === "Z to A") return b.recipient_sender.localeCompare(a.recipient_sender);
    if (sortBy === "Highest") return b.amount - a.amount;
    if (sortBy === "Lowest") return a.amount - b.amount;
    return 0;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <Loading message="Carregando suas transações..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold text-grey-900">Transactions</h1>
        <Button className="w-full md:w-auto px-6" onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-2">
            <Plus size={18} />
            <span>Add Transaction</span>
          </div>
        </Button>
      </div>

      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddTransaction}
      />

      <Card className="p-4 md:p-8 bg-white text-grey-900">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search transaction"
              className="w-full pl-4 pr-10 py-3 border border-beige-500 rounded-lg outline-none focus:border-grey-900 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-beige-500" size={20} />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-grey-500 hidden sm:inline">Sort by</span>
              <select 
                className="border border-beige-500 rounded-lg px-4 py-3 outline-none focus:border-grey-900"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Latest">Latest</option>
                <option value="Oldest">Oldest</option>
                <option value="A to Z">A to Z</option>
                <option value="Z to A">Z to A</option>
                <option value="Highest">Highest</option>
                <option value="Lowest">Lowest</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-grey-500 hidden sm:inline">Category</span>
              <select 
                className="border border-beige-500 rounded-lg px-4 py-3 outline-none focus:border-grey-900"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>All Transactions</option>
                <option>Entertainment</option>
                <option>Bills</option>
                <option>Groceries</option>
                <option>Dining Out</option>
                <option>Transportation</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-b border-beige-100">
              <tr className="text-grey-500 text-xs uppercase">
                <th className="py-4 font-normal">Recipient / Sender</th>
                <th className="py-4 font-normal">Category</th>
                <th className="py-4 font-normal">Date</th>
                <th className="py-4 font-normal text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {currentTransactions.map((transaction) => (
                <tr key={transaction.id} className="text-sm">
                  <td className="py-4 font-bold">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange/20 text-orange flex items-center justify-center uppercase">{transaction.recipient_sender.charAt(0)}</div>
                      {transaction.recipient_sender}
                    </div>
                  </td>
                  <td className="py-4 text-grey-500">{transaction.category}</td>
                  <td className="py-4 text-grey-500">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className={`py-4 text-right font-bold ${transaction.amount > 0 ? "text-green" : "text-red"}`}>
                    {transaction.amount > 0 ? "+ " : "- "}${Math.abs(transaction.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 border border-beige-500 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-10 h-10 rounded-lg text-sm border ${currentPage === i + 1 ? "bg-grey-900 text-white border-grey-900" : "border-beige-500 hover:border-grey-900"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 border border-beige-500 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </Card>
    </div>
  );
}