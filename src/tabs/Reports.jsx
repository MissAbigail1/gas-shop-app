import React, { useState } from 'react';
import { Share2, AlertCircle } from 'lucide-react';

export default function Reports({ store }) {
  const { transactions, debts } = store;
  const [period, setPeriod] = useState('Today');

  // Filter periods
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const weekStart = new Date(todayStart);
  weekStart.setDate(todayStart.getDate() - todayStart.getDay());
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const filteredTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    if (period === 'Today') return d >= todayStart;
    if (period === 'This Week') return d >= weekStart;
    if (period === 'This Month') return d >= monthStart;
    if (period === 'This Year') return d >= yearStart;
    return true;
  });

  // Calculate stats
  const totalRevenue = filteredTransactions.reduce((acc, t) => acc + t.price, 0);
  const totalTxs = filteredTransactions.length;

  const sales12 = filteredTransactions.filter(t => t.type === '12kg');
  const count12 = sales12.length;
  const rev12 = sales12.reduce((acc, t) => acc + t.price, 0);

  const sales6 = filteredTransactions.filter(t => t.type === '6kg');
  const count6 = sales6.length;
  const rev6 = sales6.reduce((acc, t) => acc + t.price, 0);

  const totalUnits = count12 + count6;
  const ratio12 = totalUnits > 0 ? (count12 / totalUnits) * 100 : 50;
  const ratio6 = totalUnits > 0 ? (count6 / totalUnits) * 100 : 50;

  // Debts calculation
  const pendingDebts = debts.filter(d => !d.returned);
  const debtsValueEst = pendingDebts.reduce((acc, d) => {
    return acc + (d.bottleSize === '12kg' ? 500000 : 280000);
  }, 0);

  const handleShare = () => {
    const text = `📊 Gas Shop Report – ${period}
Total Revenue: Le ${totalRevenue.toLocaleString()}
12kg Bottles Sold: ${count12} (Le ${rev12.toLocaleString()})
6kg Bottles Sold: ${count6} (Le ${rev6.toLocaleString()})
Bottles Owed by Customers: ${pendingDebts.length}
——
Powered by ShopManager`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Report copied! Opening WhatsApp...');
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }).catch(() => {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      
      {/* Period Selectors */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {['Today', 'This Week', 'This Month', 'This Year'].map(p => (
          <button 
            key={p}
            className="btn"
            style={{ 
              flex: '0 0 auto',
              height: '36px', 
              padding: '0 16px', 
              borderRadius: '18px',
              whiteSpace: 'nowrap',
              backgroundColor: period === p ? 'var(--text-primary)' : '#F3F4F6',
              color: period === p ? 'white' : 'var(--text-secondary)',
              fontSize: '14px'
            }}
            onClick={() => setPeriod(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Revenue Card (Orange) */}
      <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>Total Revenue</h2>
        <div style={{ fontSize: '36px', fontWeight: 700, marginTop: '8px' }}>
          Le {totalRevenue.toLocaleString()}
        </div>
        <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.9 }}>
          from {totalTxs} transactions
        </p>
      </div>

      {/* Breakdown Cards */}
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Sales Breakdown</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>12kg Sales</div>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{count12} <span style={{fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)'}}>units</span></div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>Le {rev12.toLocaleString()}</div>
        </div>
        <div className="card" style={{ marginBottom: 0, padding: '16px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>6kg Sales</div>
          <div style={{ fontSize: '28px', fontWeight: 700, margin: '8px 0' }}>{count6} <span style={{fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)'}}>units</span></div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>Le {rev6.toLocaleString()}</div>
        </div>
      </div>

      {/* Ratios Bar */}
      {totalUnits > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            <span>{ratio12.toFixed(0)}% 12kg</span>
            <span>{ratio6.toFixed(0)}% 6kg</span>
          </div>
          <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{ width: `${ratio12}%`, backgroundColor: '#3B82F6' }}></div>
            <div style={{ width: `${ratio6}%`, backgroundColor: '#8B5CF6' }}></div>
          </div>
        </div>
      )}

      {/* Debts Summary */}
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Bottle Debt Summary</h3>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '10px', borderRadius: '50%' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{pendingDebts.length} Bottles Owed</div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}>Estimated Value</div>
          </div>
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>
          Le {debtsValueEst.toLocaleString()}
        </div>
      </div>

      {/* Share Button */}
      <button 
        className="btn"
        style={{ 
          width: '100%', 
          backgroundColor: '#25D366', // WhatsApp Green
          color: 'white', 
          height: '56px',
          marginTop: '16px',
          display: 'flex',
          gap: '12px',
          fontSize: '16px',
          fontWeight: 600
        }}
        onClick={handleShare}
      >
        <Share2 size={20} />
        Share Summary via WhatsApp
      </button>

    </div>
  );
}
