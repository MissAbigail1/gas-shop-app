import React, { useState } from 'react';
import { Edit2, Plus, Minus } from 'lucide-react';

export default function Stock({ store }) {
  const { stock, adjustStock } = store;

  const [editingItem, setEditingItem] = useState(null);
  const [editCount, setEditCount] = useState(0);

  const handleEdit = (key) => {
    setEditingItem(key);
    setEditCount(stock[key]);
  };

  const handleSave = (key) => {
    // Send a silent reason so history is technically kept if ever needed later
    adjustStock(key, editCount, "Quick update");
    setEditingItem(null);
  };

  const renderCardOrEditor = (key, title, bgClassName, accentColor) => {
    if (editingItem === key) {
      return (
        <div className="card animate-slide-up" style={{ gridColumn: '1 / -1', border: `2px solid ${accentColor}`, margin: 0 }}>
          <h3 style={{fontSize: '18px', fontWeight: 700, marginBottom: '24px', color: 'var(--text-primary)', textAlign: 'center'}}>
            Adjusting {title}
          </h3>
          
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', padding: '0 16px'}}>
            <button 
              className="btn" 
              style={{
                width: 72, 
                height: 72, 
                borderRadius: '36px', 
                backgroundColor: '#FEE2E2', 
                color: '#DC2626',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }} 
              onClick={() => setEditCount(prev => Math.max(0, prev - 1))}
            >
              <Minus size={32} strokeWidth={3} />
            </button>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <span style={{fontSize: '48px', fontWeight: 800, lineHeight: 1}}>{editCount}</span>
              <span style={{fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '4px'}}>Current Count</span>
            </div>

            <button 
              className="btn" 
              style={{
                width: 72, 
                height: 72, 
                borderRadius: '36px', 
                backgroundColor: '#DCFCE7', 
                color: '#16A34A',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }} 
              onClick={() => setEditCount(prev => prev + 1)}
            >
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>
          
          <div style={{display: 'flex', gap: '16px'}}>
            <button 
              className="btn" 
              style={{flex: 1, backgroundColor: '#F3F4F6', color: 'var(--text-primary)', height: '60px', fontSize: '18px', borderRadius: '12px', fontWeight: 600}} 
              onClick={() => setEditingItem(null)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              style={{flex: 1, backgroundColor: accentColor, height: '60px', fontSize: '18px', borderRadius: '12px', fontWeight: 600}} 
              onClick={() => handleSave(key)}
            >
              Save ✓
            </button>
          </div>
        </div>
      );
    }

    // Normal Card
    return (
      <div 
        className="card" 
        style={{...styles[bgClassName], position: 'relative', cursor: 'pointer', margin: 0 }} 
        onClick={() => handleEdit(key)}
      >
        <div style={{position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)', opacity: 0.6}}>
          <Edit2 size={24} />
        </div>
        <div style={styles.stockNumber}>{stock[key]}</div>
        <div style={styles.stockLabel}>{title}</div>
      </div>
    );
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      
      <div style={{ marginBottom: '32px', textAlign: 'center', marginTop: '8px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 800, color: 'var(--text-primary)' }}>My Stock</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', marginTop: '8px', fontWeight: 500 }}>Tap any card to correct your numbers</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {renderCardOrEditor('filled12kg', 'Filled 12kg', 'stockCardGreen', '#16A34A')}
        {renderCardOrEditor('empty12kg', 'Empty 12kg', 'stockCardGray', '#4B5563')}
        {renderCardOrEditor('filled6kg', 'Filled 6kg', 'stockCardGreen', '#16A34A')}
        {renderCardOrEditor('empty6kg', 'Empty 6kg', 'stockCardGray', '#4B5563')}
      </div>

    </div>
  );
}

const styles = {
  stockCardGreen: {
    backgroundColor: '#DCFCE7',
    borderRadius: '20px',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #BBF7D0',
    transition: 'transform 0.1s ease',
  },
  stockCardGray: {
    backgroundColor: '#F1F5F9',
    borderRadius: '20px',
    padding: '32px 16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #CBD5E1',
    transition: 'transform 0.1s ease',
  },
  stockNumber: {
    fontSize: '42px',
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  stockLabel: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    marginTop: '8px',
  }
};
