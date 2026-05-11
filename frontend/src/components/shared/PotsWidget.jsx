import { useState, useEffect } from "react";
import { Card } from "../ui/Card";
import { financialService } from "../../services/financialService";

export default function PotsWidget({ setActiveTab }) {
  const [pots, setPots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPots() {
      try {
        const data = await financialService.getPots();
        setPots(data.slice(0, 4)); // Mostra apenas as 4 primeiras no widget
      } catch (error) {
        console.error("Error loading pots:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPots();
  }, []);

  const totalSaved = pots.reduce((acc, pot) => acc + parseFloat(pot.total_saved), 0);

  if (loading) return <Card className="bg-white p-6">Loading pots...</Card>;

  return (
    <Card className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-grey-900">Pots</h2>
        <button 
          onClick={() => setActiveTab('Pots')}
          className="text-sm text-grey-500 hover:underline cursor-pointer"
        >
          See Details ›
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Lado Esquerdo: Total */}
        <div className="flex items-center gap-4 bg-beige-100 p-4 rounded-xl w-full md:w-auto min-w-[180px]">
          <span className="text-3xl">🍯</span>
          <div>
            <p className="text-xs text-grey-500">Total Saved</p>
            <p className="text-2xl font-bold">${totalSaved.toLocaleString()}</p>
          </div>
        </div>

        {/* Lado Direito: Grid de Categorias */}
        <div className="grid grid-cols-2 gap-4 flex-1 w-full">
          {pots.map((pot) => (
            <div key={pot.id} className="border-l-4 pl-4 py-1" style={{ borderColor: pot.color }}>
              <p className="text-xs text-grey-500 truncate">{pot.name}</p>
              <p className="text-sm font-bold">${parseFloat(pot.total_saved).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}