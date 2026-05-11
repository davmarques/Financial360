import { useState } from "react";
import {
  House,
  ArrowUpDown,
  ChartPie,
  PiggyBank,
  Receipt,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const menuItems = [
  { id: 'Overview', label: 'Overview', icon: House },
  { id: 'Transactions', label: 'Transactions', icon: ArrowUpDown },
  { id: 'Budgets', label: 'Budgets', icon: ChartPie },
  { id: 'Pots', label: 'Pots', icon: PiggyBank },
  { id: 'Recurring Bills', label: 'Recurring Bills', icon: Receipt },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex ${isMinimized ? 'w-20' : 'w-50'} bg-grey-900 text-white flex-col rounded-r-2xl h-screen sticky top-0 transition-all duration-300`}>
        {/* Logo Area */}
        <div className={`py-10 transition-all ${isMinimized ? 'px-4' : 'px-6'}`}>
          <h1 className={`${isMinimized ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight`}>
            {isMinimized ? 'f360' : 'financial360'}
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 pr-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isMinimized ? item.label : ''}
                className={`w-full flex items-center gap-4 px-4 py-4 cursor-pointer rounded-r-xl transition-all group ${isActive
                    ? 'bg-beige-100 text-grey-900 border-l-4 border-green font-bold'
                    : 'text-grey-300 hover:text-white'
                  }`}
              >
                <Icon
                  size={24}
                  className={isActive ? 'text-green' : 'text-grey-300 group-hover:text-white'}
                />
                {!isMinimized && <span className="text-base whitespace-nowrap overflow-hidden">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout and Minimize Button */}
        <div className={`p-8 space-y-4 group transition-all ${isMinimized ? 'px-0 flex flex-row items-center' : ''}`}>
          {/* {!isMinimized && <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-4 text-grey-300 hover:text-red-400 transition-colors w-full"
            title={isMinimized ? "Logout" : ""}
          >
            <LogOut size={24}  />
          </button>} */}

          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="flex items-center gap-4 text-grey-300 hover:text-white transition-colors w-full"
          >
            {isMinimized ? (
              <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform flex ml-4" />
            ) : (
              <>
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform flex mr-4" />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed -bottom-1 left-0 w-full bg-grey-900 text-white px-2 py-1 flex justify-around items-center rounded-t-xl z-50 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 transition-all max-w-[20%] ${isActive
                  ? 'bg-beige-100 text-grey-900 rounded-t-lg border-b-4 border-green '
                  : 'text-grey-300'
                }`}
            >
              <Icon
                size={24}
                className={isActive ? 'text-green' : 'text-grey-300'}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
}