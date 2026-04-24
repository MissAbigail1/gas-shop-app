import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Dashboard({ store, setActiveTab }) {
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const { stock, transactions, debts, addTransaction, addDebt } = store;

  const [type, setType] = useState('12kg');
  const [price, setPrice] = useState('500000');
  const [hadEmptyBottle, setHadEmptyBottle] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Today's Revenue
  const todaysSales = transactions.filter(t => {
    const today = new Date().toDateString();
    const txDate = new Date(t.date).toDateString();
    return today === txDate;
  });
  const revenueToday = todaysSales.reduce((acc, curr) => acc + curr.price, 0);

  // Debt count
  const activeDebts = debts.filter(d => !d.returned);

  const handleSetType = (newType) => {
    setType(newType);
    setPrice(newType === '12kg' ? '500000' : '280000');
  };

  const handleOpenModal = () => {
    // Reset form to default states anytime they open the modal
    handleSetType('12kg');
    setHadEmptyBottle(true);
    setCustomerName('');
    setCustomerPhone('');
    setShowSaleModal(true);
  };

  const handleSubmitSale = (e) => {
    e.preventDefault();
    if (!price) return;
    
    if (!hadEmptyBottle && !customerName.trim()) {
      alert("Customer name is required for debts.");
      return;
    }

    addTransaction({
      type,
      price: parseFloat(price),
      hadEmptyBottle,
    });

    if (!hadEmptyBottle) {
      addDebt({
        customerName: customerName,
        customerPhone: customerPhone,
        bottleSize: type
      });
    }

    setShowSaleModal(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      {/* Greeting Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>{greeting} 👋</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>{currentDate}</p>
      </div>

      {/* 2x2 Stock Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={styles.stockCardGreen}>
          <div style={styles.stockNumber}>{stock.filled12kg}</div>
          <div style={styles.stockLabel}>Filled 12kg</div>
        </div>
        <div style={styles.stockCardGray}>
          <div style={styles.stockNumber}>{stock.empty12kg}</div>
          <div style={styles.stockLabel}>Empty 12kg</div>
        </div>
        <div style={styles.stockCardGreen}>
          <div style={styles.stockNumber}>{stock.filled6kg}</div>
          <div style={styles.stockLabel}>Filled 6kg</div>
        </div>
        <div style={styles.stockCardGray}>
          <div style={styles.stockNumber}>{stock.empty6kg}</div>
          <div style={styles.stockLabel}>Empty 6kg</div>
        </div>
      </div>

      {/* Revenue Banner */}
      <div className="card" style={{ backgroundColor: 'var(--primary)', color: 'white', border: 'none', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 500, opacity: 0.9 }}>Today's Revenue</h2>
        <div style={{ fontSize: '36px', fontWeight: 700, marginTop: '8px' }}>
          Le {revenueToday.toLocaleString()}
        </div>
      </div>

      {/* Debts Alert */}
      {activeDebts.length > 0 && (
        <div className="card" style={{ backgroundColor: '#FFFBEB', borderColor: '#FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#B45309' }}>
            <AlertCircle size={24} />
            <span style={{ fontWeight: 600, fontSize: '15px' }}>{activeDebts.length} {activeDebts.length === 1 ? 'customer owes' : 'customers owe'} a bottle</span>
          </div>
          <button 
            className="btn" 
            style={{ minHeight: '36px', minWidth: '80px', backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '14px', borderRadius: '6px' }}
            onClick={() => setActiveTab('debts')}
          >
            View All
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <div style={styles.fabContainer}>
        <button className="btn btn-primary" style={styles.fab} onClick={handleOpenModal}>
          + New Sale
        </button>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast">
          Sale recorded! 🎉
        </div>
      )}

      {/* Sale Modal - Bottom Sheet */}
      {showSaleModal && (
        <div style={styles.modalOverlay} onClick={() => setShowSaleModal(false)}>
          {/* Prevent overlay click from closing when clicking internal card */}
          <div 
            className="card animate-slide-up" 
            style={styles.modalContent} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>New Sale</h2>
              <button 
                type="button" 
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', padding: '0 8px', color: 'var(--text-secondary)' }} 
                onClick={() => setShowSaleModal(false)}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmitSale}>
              {/* Step 1 */}
              <label className="label" style={{marginBottom: '10px', fontSize: '15px'}}>1. Bottle Size</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button type="button" className={type === '12kg' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => handleSetType('12kg')} style={{flex: 1, minHeight: '52px'}}>12kg Bottle</button>
                <button type="button" className={type === '6kg' ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => handleSetType('6kg')} style={{flex: 1, minHeight: '52px'}}>6kg Bottle</button>
              </div>

              {/* Step 2 */}
              <label className="label" style={{marginBottom: '10px', fontSize: '15px'}}>2. Amount Received (Le)</label>
              <input type="number" className="input" style={{marginBottom: '24px', fontSize: '18px', fontWeight: 600}} value={price} onChange={(e) => setPrice(e.target.value)} required />

              {/* Step 3 */}
              <label className="label" style={{marginBottom: '10px', fontSize: '15px'}}>3. Did they bring an empty bottle?</label>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button type="button" className={hadEmptyBottle ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setHadEmptyBottle(true)} style={{flex: 1, minHeight: '52px'}}>YES</button>
                <button type="button" className={!hadEmptyBottle ? 'btn btn-primary' : 'btn btn-outline'} onClick={() => setHadEmptyBottle(false)} style={{flex: 1, minHeight: '52px'}}>NO</button>
              </div>

              {hadEmptyBottle ? (
                <div style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
                  ✅ Normal exchange
                </div>
              ) : (
                <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <label className="label">Customer Name</label>
                  <input type="text" className="input" style={{backgroundColor: 'white'}} value={customerName} onChange={(e) => setCustomerName(e.target.value)} required placeholder="Required" />
                  
                  <label className="label">Phone Number (Optional)</label>
                  <input type="tel" className="input" style={{backgroundColor: 'white', marginBottom: '12px'}} value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="Recommended" />
                  
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.4, fontWeight: 500 }}>
                    This customer will be added to your debt list until they return a bottle.
                  </p>
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ height: '60px', fontSize: '18px', fontWeight: 600 }}>
                Complete Sale ✓
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  stockCardGreen: {
    backgroundColor: '#DCFCE7',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #bbF7D0',
  },
  stockCardGray: {
    backgroundColor: '#F3F4F6',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #E5E7EB',
  },
  stockNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  stockLabel: {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  fabContainer: {
    position: 'fixed',
    bottom: '86px', 
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    minWidth: '390px',
    padding: '0 16px',
    zIndex: 20,
    boxSizing: 'border-box'
  },
  fab: {
    height: '56px',
    fontSize: '18px',
    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)',
    borderRadius: '12px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '430px',
    minWidth: '390px',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: '100%',
    marginBottom: '0',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '24px',
    paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
    maxHeight: '90vh',
    overflowY: 'auto'
  }
};
