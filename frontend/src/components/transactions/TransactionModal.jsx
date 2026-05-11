// src/components/transactions/TransactionModal.jsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

export default function TransactionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    recipient_sender: '',
    category: 'Entertainment',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    recurring: false,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAdd({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    setLoading(false);
    onClose();
    setFormData({
      recipient_sender: '',
      category: 'Entertainment',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'expense',
      recurring: false,
    });
  };

  const categories = [
    'Entertainment',
    'Bills',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Personal Care',
    'Education',
    'Lifestyle',
    'Shopping',
    'General'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <Card className="relative w-full max-w-[560px] bg-white p-8 md:p-10 animate-modalEnter">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-grey-500 hover:text-grey-900 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-[32px] font-bold text-[#201F24] mb-8">Add New Transaction</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            id="recipient_sender"
            label="Recipient / Sender"
            placeholder="e.g. Starbucks"
            value={formData.recipient_sender}
            onChange={(e) => setFormData({...formData, recipient_sender: e.target.value})}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#696868]">Type</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-[#98908B] focus:border-[#201F24] focus:outline-none focus:ring-1 focus:ring-[#201F24] transition-all bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-[#696868]">Category</label>
              <select 
                className="w-full px-4 py-3 rounded-lg border border-[#98908B] focus:border-[#201F24] focus:outline-none focus:ring-1 focus:ring-[#201F24] transition-all bg-white"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              id="amount"
              type="number"
              step="0.01"
              label="Amount"
              placeholder="e.g. 15.50"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              required
            />

            <Input 
              id="date"
              type="date"
              label="Transaction Date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#F8F4F0] rounded-lg border border-[#98908B]/20">
            <input 
              type="checkbox" 
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
              className="w-5 h-5 rounded border-[#98908B] text-[#201F24] focus:ring-[#201F24]"
            />
            <label htmlFor="recurring" className="text-sm font-bold text-[#201F24] cursor-pointer">
              Recurring Transaction
            </label>
          </div>

          <div className="pt-4 flex gap-4">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding...' : 'Add Transaction'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
