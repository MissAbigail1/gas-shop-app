import React from 'react';
import { Home, Package, Users, BarChart2 } from 'lucide-react';

export default function BottomNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'stock', icon: Package, label: 'Stock' },
    { id: 'debts', icon: Users, label: 'Debts' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
  ];

  return (
    <div style={styles.nav}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button 
            key={tab.id}
            style={{...styles.tabBtn, color: isActive ? 'var(--primary)' : 'var(--text-secondary)'}}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{...styles.label, fontWeight: isActive ? 600 : 500}}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    minWidth: '390px',
    height: '70px',
    backgroundColor: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 'env(safe-area-inset-bottom)', // for iPhone X+ home indicator
    zIndex: 10,
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '64px',
    minHeight: '48px', // large touch target
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  label: {
    fontSize: '11px',
    marginTop: '4px',
  }
};
