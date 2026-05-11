// src/App.jsx
import { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Overview from './pages/Overview';
import Transactions from './pages/Transactions';
import Pots from './pages/Pots';
import Budgets from './pages/Budgets';
import RecurringBills from './pages/RecurringBills';
import Auth from './pages/Auth';
import Loading from './components/ui/Loading';
import { supabase } from './lib/supabase';

function App() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <Loading fullScreen message="Iniciando Financial360..." />;
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F4F0] font-sans">
      {/* Sidebar passando o estado para controlar a navegação */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 px-6 md:px-10 mt-8  max-w-[1600px] mx-auto">

        {/* Renderização dinâmica */}
        {activeTab === 'Overview' && <Overview setActiveTab={setActiveTab} />}
        {activeTab === 'Transactions' && <Transactions />}
        {activeTab === 'Pots' && <Pots />}
        {activeTab === 'Budgets' && <Budgets setActiveTab={setActiveTab} />}
        {activeTab === 'Recurring Bills' && <RecurringBills />}

      </main>
    </div>
  );
}

export default App;