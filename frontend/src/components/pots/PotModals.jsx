// src/components/pots/PotModals.jsx
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import CustomSelect from '../ui/CustomSelect';

const themes = [
  { name: 'Green', color: '#277C78' },
  { name: 'Cyan', color: '#82C9D7' },
  { name: 'Navy', color: '#626070' },
  { name: 'Orange', color: '#F2CDAC' },
  { name: 'Purple', color: '#AF81BA' },
];

export default function PotModal({ isOpen, onClose, type, potData, onConfirm }) {
  // Estados para os inputs
  const [amount, setAmount] = useState('');
  const [name, setName] = useState(potData?.name || '');
  const [target, setTarget] = useState(potData?.target || '');
  const [theme, setTheme] = useState(themes[0]);
  const [error, setError] = useState('');

  // Resetar estados quando o modal abrir/fechar ou mudar de tipo
  useEffect(() => {
    setAmount('');
    setName(potData?.name || '');
    setTarget(potData?.target || '');
    setTheme(themes.find(t => t.color === potData?.color) || themes[0]);
    setError('');
  }, [isOpen, type, potData]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Validação simples para Add/Withdraw
    if ((type === 'add' || type === 'withdraw') && (!amount || isNaN(amount) || amount <= 0)) {
      setError('Please enter a valid amount.');
      return;
    }
    // Validação para New/Edit
    if ((type === 'new' || type === 'edit') && (!name || !target)) {
      setError('Name and target are required.');
      return;
    }

    // Chamar a função de confirmação passando os dados relevantes
    onConfirm({ type, amount: parseFloat(amount), name, target: parseFloat(target), theme });
    onClose();
  };

  // --- Renderização Condicional do Título e Conteúdo ---
  let title = '';
  let description = '';
  let confirmText = '';
  let confirmClass = 'bg-grey-900 text-white';

  switch (type) {
    case 'add':
      title = `Add to ‘${potData.name}’`;
      description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet.';
      confirmText = 'Confirm Addition';
      break;
    case 'withdraw':
      title = `Withdraw from ‘${potData.name}’`;
      description = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque aliquet nibh nec urna. In nisi neque, aliquet.';
      confirmText = 'Confirm Withdrawal';
      break;
    case 'new':
      title = 'Add New Pot';
      description = 'Create a pot to set savings targets. These can help keep you on track as you save for special purchases.';
      confirmText = 'Add Pot';
      break;
    case 'edit':
      title = 'Edit Pot';
      description = 'If your saving targets change, feel free to update your pots.';
      confirmText = 'Save Changes';
      break;
    case 'delete':
      title = `Delete ‘${potData.name}’?`;
      description = 'Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever.';
      confirmText = 'Yes, Confirm Deletion';
      confirmClass = 'bg-red text-white';
      break;
  }

  // --- Funções Auxiliares de Renderização de Input ---
  const renderAmountInput = (label, value, onChange) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-grey-500">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-grey-300">$</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. 50"
          className="w-full pl-8 pr-4 py-3 border border-beige-500 rounded-lg outline-none focus:border-grey-900"
        />
      </div>
    </div>
  );

  const renderTextInput = (label, value, onChange, placeholder, maxLength) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-grey-500">{label}</label>
        {maxLength && <span className="text-xs text-grey-500">{maxLength - value.length} characters left</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3 border border-beige-500 rounded-lg outline-none focus:border-grey-900"
      />
    </div>
  );

  const renderProgressSection = (isWithdraw) => {
    const currentTotal = potData.total;
    const changeAmount = parseFloat(amount) || 0;
    const newTotal = isWithdraw ? Math.max(0, currentTotal - changeAmount) : currentTotal + changeAmount;
    const percentage = Math.min((newTotal / potData.target) * 100, 100);
    const colorClass = isWithdraw ? 'bg-red' : `bg-[${potData.color}]`;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-grey-500">New Amount</p>
          <p className="text-3xl font-bold text-grey-900">${newTotal.toFixed(2)}</p>
        </div>
        <ProgressBar value={newTotal} target={potData.target} colorClass={colorClass} hClass="h-2" />
        <div className="flex justify-between text-xs font-bold">
          <span className={isWithdraw ? 'text-red' : 'text-green'}>{percentage.toFixed(2)}%</span>
          <span className="text-grey-500">Target of ${potData.target}</span>
        </div>
      </div>
    );
  };

  return (
    // Overlay de fundo
    <div className="fixed inset-0 z-[9999] flex items-center justify-center m-0 p-4 overflow-hidden">

      {/* OVERLAY ESCURO
         - h-screen w-screen: Força a altura e largura total da janela
      */}
      <div
        className="fixed inset-0 bg-black/50 w-full h-full animate-fadeIn"
        onClick={onClose}
      />
      {/* Container do Modal */}
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 md:p-10 relative space-y-6 animate-modalEnter">
        {/* Botão Fechar */}
        <button onClick={onClose} className="absolute right-6 top-6 text-grey-300 hover:text-grey-900">
          <X size={24} />
        </button>

        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-grey-900">{title}</h2>
          <p className="text-sm text-grey-500 leading-relaxed">{description}</p>
        </div>

        {/* Conteúdo Dinâmico Baseado no Tipo */}
        {(type === 'add' || type === 'withdraw') && renderProgressSection(type === 'withdraw')}

        {type === 'add' && renderAmountInput('Amount to Add', amount, setAmount)}
        {type === 'withdraw' && renderAmountInput('Amount to Withdraw', amount, setAmount)}

        {(type === 'new' || type === 'edit') && (
          <div className="space-y-6">
            {renderTextInput('Pot Name', name, setName, 'e.g. Rainy Days', 30)}
            {renderAmountInput('Target', target, setTarget)}

            <CustomSelect
                label="Theme"
                options={themes}
                selected={theme}
                onSelect={setTheme}
                type="color"
                direction="up"
            />
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && <p className="text-xs text-red mt-[-1rem]">{error}</p>}

        {/* Botões de Ação */}
        <div className="space-y-2">
          <button onClick={handleConfirm} className={`w-full py-4 rounded-lg font-bold transition-all hover:opacity-90 ${confirmClass}`}>
            {confirmText}
          </button>

          {type === 'delete' && (
            <button onClick={onClose} className="w-full py-4 text-sm text-grey-500 hover:text-grey-900 font-bold">
              No, Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}