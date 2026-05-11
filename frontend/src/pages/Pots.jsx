import { useState, useEffect } from 'react';
import PotCard from '../components/pots/PotCard';
import PotModal from '../components/pots/PotModals';
import ErrorModal from '../components/ui/ErrorModal';
import Loading from '../components/ui/Loading';
import { financialService } from '../services/financialService';

export default function Pots() {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para gerenciar o modal
  const [modalState, setModalState] = useState({ isOpen: false, type: null, potData: null });
  const [errorConfig, setErrorConfig] = useState({ isOpen: false, title: '', message: '' });

  const loadPots = async () => {
    try {
      setLoading(true);
      const data = await financialService.getPots();
      // Mapear campos do banco para o que o componente espera se necessário
      const formattedPots = data.map(p => ({
        id: p.id,
        name: p.name,
        target: parseFloat(p.target),
        total: parseFloat(p.total_saved),
        color: p.color
      }));
      setPots(formattedPots);
    } catch (error) {
      console.error("Error loading pots:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPots();
  }, []);

  const openModal = (type, pot = null) => {
    setModalState({ isOpen: true, type, potData: pot });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, type: null, potData: null });
  };

  const handleConfirmAction = async (data) => {
    try {
      if (data.type === 'new') {
        await financialService.addPot({
          name: data.name,
          target: data.target,
          color: data.theme.color
        });
      } else if (data.type === 'edit') {
        await financialService.updatePot(modalState.potData.id, {
          name: data.name,
          target: data.target,
          color: data.theme.color
        });
      } else if (data.type === 'delete') {
        if (modalState.potData.total > 0) {
          setErrorConfig({
            isOpen: true,
            title: "Cannot Delete Pot",
            message: "This pot still has a balance. Please withdraw all funds first."
          });
          return;
        }
        await financialService.deletePot(modalState.potData.id);
      } else if (data.type === 'add' || data.type === 'withdraw') {
        const currentTotal = modalState.potData.total;
        const change = data.amount;

        // Validações de Saldo
        if (data.type === 'withdraw' && change > currentTotal) {
          setErrorConfig({
            isOpen: true,
            title: "Insufficient Savings",
            message: `You only have $${currentTotal.toFixed(2)} in this pot.`
          });
          return;
        }

        if (data.type === 'add') {
          const summary = await financialService.getBalanceSummary();
          if (change > summary.currentBalance) {
            setErrorConfig({
              isOpen: true,
              title: "Insufficient Funds",
              message: `Your current balance is $${summary.currentBalance.toFixed(2)}, which is less than the $${change.toFixed(2)} you're trying to add.`
            });
            return;
          }
        }

        const newTotal = data.type === 'add' ? currentTotal + change : currentTotal - change;
        
        // Atualiza o saldo do Pot
        await financialService.updatePotBalance(modalState.potData.id, newTotal);

        // Registra a transação correspondente
        // No Add Money, conta como expense (sai da conta para o pot)
        // No Withdraw, conta como income (volta do pot para a conta)
        await financialService.addTransaction({
          recipient_sender: `Pot: ${modalState.potData.name}`,
          category: 'Savings',
          amount: change,
          date: new Date().toISOString(),
          type: data.type === 'add' ? 'expense' : 'income',
          recurring: false
        });
      }

      console.log('Action Confirmed:', data);
      // Recarregar dados após qualquer ação de alteração
      await loadPots();
      closeModal();
    } catch (error) {
      console.error("Error performing pot action:", error);
      setErrorConfig({
        isOpen: true,
        title: "Action Failed",
        message: "An error occurred while processing your request. Please try again."
      });
    }
  };

  if (loading) return <Loading message="Carregando seus potes de economia..." />;

  return (
    <div className="space-y-10">
      {/* Botão do Header para Novo Pot */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-grey-900">Pots</h1>
        <button 
          onClick={() => openModal('new')}
          className="bg-grey-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-[#444444] transition-colors"
        >
          + Add New Pot
        </button>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {pots.map((pot) => (
          <PotCard key={pot.id} pot={pot} onAction={openModal} />
        ))}
      </div>

      {/* O Componente Único de Modal */}
      <PotModal 
        {...modalState} 
        onClose={closeModal} 
        onConfirm={handleConfirmAction}
      />

      <ErrorModal 
        isOpen={errorConfig.isOpen}
        title={errorConfig.title}
        message={errorConfig.message}
        onClose={() => setErrorConfig({ ...errorConfig, isOpen: false })}
      />
    </div>
  );
}