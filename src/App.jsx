import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './tabs/Dashboard';
import Stock from './tabs/Stock';
import Debts from './tabs/Debts';
import Reports from './tabs/Reports';
import PinLock from './components/PinLock';
import { useStore } from './hooks/useStore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isUnlocked, setIsUnlocked] = useState(
    localStorage.getItem('gasShopUnlocked') === 'true'
  );
  const store = useStore();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard store={store} setActiveTab={setActiveTab} />;
      case 'stock': return <Stock store={store} />;
      case 'debts': return <Debts store={store} />;
      case 'reports': return <Reports store={store} />;
      default: return <Dashboard store={store} setActiveTab={setActiveTab} />;
    }
  };

  const titles = {
    'dashboard': 'Gas Shop Dashboard',
    'stock': 'Inventory Management',
    'debts': 'Customer Debts',
    'reports': 'Sales Reports'
  };

  // If locked, show the PIN screen entirely and hide all data
  if (!isUnlocked) {
    return <PinLock onUnlock={() => setIsUnlocked(true)} correctPin="2010" />;
  }

  if (store.loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: 'var(--bg)'}}>
        <div style={{width: '48px', height: '48px', border: '4px solid #e5e7eb', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
        <p style={{marginTop: '16px', color: 'var(--text-secondary)', fontWeight: 500}}>Syncing shop data...</p>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (store.errorObj) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', backgroundColor: '#FEF2F2', padding: '24px', textAlign: 'center'}}>
        <div style={{color: '#DC2626', fontSize: '48px', marginBottom: '16px'}}>⚠️</div>
        <h2 style={{color: '#DC2626', fontWeight: 700, marginBottom: '8px'}}>Database Error</h2>
        <p style={{color: '#991B1B', fontWeight: 500}}>{store.errorObj}</p>
        <p style={{color: '#991B1B', marginTop: '16px', fontSize: '14px', maxWidth: '400px'}}>
          This usually happens if you didn't click "Create Database" in Firestore or didn't set permission rules to "Test Mode" inside your Firebase Console.
        </p>
      </div>
    );
  }

  return (
    <>
      <Header title={titles[activeTab]} />
      <main>
        {renderTab()}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
