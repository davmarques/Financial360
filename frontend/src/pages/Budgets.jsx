import { useState, useEffect } from 'react';
import BudgetSummary from '../components/shared/BudgetsWidget';
import BudgetDetailCard from '../components/shared/BudgetDetailCard';
import BudgetModal from '../components/budgets/BudgetsModals';
import ErrorModal from '../components/ui/ErrorModal';
import Loading from '../components/ui/Loading';
import { financialService } from '../services/financialService';

export default function Budgets({ setActiveTab }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para controlar o Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: null, // 'new', 'edit' ou 'delete'
    data: null
  });

  const [errorConfig, setErrorConfig] = useState({
    isOpen: false,
    message: ''
  });

  const loadBudgets = async () => {
    try {
      setLoading(true);
      const data = await financialService.getBudgets();
      const formatted = data.map(b => ({
        id: b.id,
        category: b.category,
        spent: parseFloat(b.spent || 0),
        limit: parseFloat(b.amount_limit),
        color: b.color,
        latestTransactions: b.latestTransactions
      }));
      setBudgets(formatted);
    } catch (error) {
      console.error("Error loading budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const openModal = (type, data = null) => {
    setModalConfig({ isOpen: true, type, data });
  };

  const closeModal = () => {
    setModalConfig({ isOpen: false, type: null, data: null });
  };

  const handleConfirm = async (formData) => {
    try {
      if (formData.type === 'new') {
        await financialService.addBudget(formData);
      } else if (formData.type === 'edit') {
        await financialService.updateBudget(formData.id, formData);
      } else if (formData.type === 'delete') {
        await financialService.deleteBudget(formData.id);
      }
      
      console.log('Action Confirmed:', formData);
      await loadBudgets(); // Recarrega após ação
      closeModal();
    } catch (error) {
      console.error("Error performing budget action:", error);
      setErrorConfig({
        isOpen: true,
        message: "Failed to save budget. Please check your connection and try again."
      });
    }
  };

  if (loading) return <Loading message="Carregando seus orçamentos..." />;

  return (
    <div className="space-y-8">
      {/* Header com botão de Novo Orçamento */}
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-grey-900">Budgets</h1>
        <button
          onClick={() => openModal('new')}
          className="bg-grey-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-grey-500 transition-colors"
        >
          + Add New Budget
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Resumo */}
        <div className="lg:col-span-12 xl:col-span-4 h-fit">
          <BudgetSummary budgets={budgets} />
        </div>

        {/* Coluna Direita: Lista de Cards */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-6 pb-10">
          {budgets.map((budget) => (
            <BudgetDetailCard
              key={budget.id}
              budget={budget}
              onAction={openModal} // Passa a função para o card
              setActiveTab={setActiveTab}
            />
          ))}
        </div>
      </div>

      {/* Modal Integrado */}
      <BudgetModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        budgetData={modalConfig.data}
        onClose={closeModal}
        onConfirm={handleConfirm}
      />

      <ErrorModal 
        isOpen={errorConfig.isOpen}
        message={errorConfig.message}
        onClose={() => setErrorConfig({ ...errorConfig, isOpen: false })}
      />
    </div>
  );
}