import React, { useState } from 'react';
import { Phone, CheckCircle2, History } from 'lucide-react';

// Simple relative date formatter
const getRelativeTimeString = (dateStr) => {
  const diffInDays = Math.floor((new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24));
  if (diffInDays === 0) return "Bought today";
  if (diffInDays === 1) return "Bought yesterday";
  return `Bought ${diffInDays} days ago`;
};

export default function Debts({ store }) {
  const { debts, resolveDebt } = store;
  const [filter, setFilter] = useState('Pending');

  const pendingDebts = debts.filter(d => !d.returned);
  const resolvedDebts = debts.filter(d => d.returned);

  const displayedDebts = filter === 'Pending' ? pendingDebts : resolvedDebts;

  const handleResolve = (debt) => {
    if (window.confirm(`Mark ${debt.customerName}'s empty bottle as returned?`)) {
      resolveDebt(debt.id);
    }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>Bottle Debts</h2>
        <div style={{ 
          backgroundColor: '#FEF2F2', // Red-50
          color: '#DC2626', // Red-600
          padding: '6px 12px', 
          borderRadius: '20px', 
          fontSize: '14px', 
          fontWeight: 600 
        }}>
          {pendingDebts.length} pending
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button 
          className="btn"
          style={{ 
            flex: 1, 
            height: '42px',
            borderRadius: '21px',
            backgroundColor: filter === 'Pending' ? 'var(--text-primary)' : '#F3F4F6',
            color: filter === 'Pending' ? 'white' : 'var(--text-secondary)'
          }}
          onClick={() => setFilter('Pending')}
        >
          Pending
        </button>
        <button 
          className="btn"
          style={{ 
            flex: 1, 
            height: '42px',
            borderRadius: '21px',
            backgroundColor: filter === 'Resolved' ? 'var(--text-primary)' : '#F3F4F6',
            color: filter === 'Resolved' ? 'white' : 'var(--text-secondary)'
          }}
          onClick={() => setFilter('Resolved')}
        >
          Resolved
        </button>
      </div>

      {/* List */}
      <div>
        {displayedDebts.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px', padding: '24px' }}>
            {filter === 'Pending' ? (
              <>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  No outstanding bottles!
                </h3>
                <p style={{ color: 'var(--text-secondary)' }}>All customers are up to date.</p>
              </>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No resolved debts yet.</p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {displayedDebts.map(debt => (
              <div 
                key={debt.id} 
                className="card" 
                style={{ 
                  margin: 0, 
                  borderLeft: `4px solid ${debt.returned ? '#10B981' : '#F59E0B'}`,
                  opacity: debt.returned ? 0.8 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {debt.customerName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ 
                        backgroundColor: debt.returned ? '#D1FAE5' : '#FEF3C7', 
                        color: debt.returned ? '#065F46' : '#92400E', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '13px', 
                        fontWeight: 600 
                      }}>
                        {debt.bottleSize} bottle
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginTop: '8px' }}>
                      <History size={14} />
                      <span suppressHydrationWarning>{getRelativeTimeString(debt.datePurchased)}</span>
                    </div>
                  </div>

                  {/* Phone Dialer */}
                  {debt.customerPhone && (
                    <a 
                      href={`tel:${debt.customerPhone}`} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '44px',
                        height: '44px',
                        backgroundColor: '#F3F4F6', 
                        borderRadius: '22px',
                        color: 'var(--primary)',
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={20} />
                    </a>
                  )}
                </div>

                {/* Actions */}
                {!debt.returned ? (
                  <button 
                    className="btn"
                    style={{ 
                      width: '100%', 
                      backgroundColor: '#10B981', 
                      color: 'white', 
                      height: '48px',
                      display: 'flex',
                      gap: '8px'
                    }}
                    onClick={() => handleResolve(debt)}
                  >
                    <CheckCircle2 size={20} />
                    Bottle Returned
                  </button>
                ) : (
                  <div style={{ 
                    backgroundColor: '#F3F4F6', 
                    color: 'var(--text-secondary)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 500
                  }}>
                    Returned on {new Date(debt.dateReturned).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
