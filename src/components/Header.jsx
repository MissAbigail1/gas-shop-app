import React from 'react';

export default function Header({ title }) {
  return (
    <header className="header" style={{ gap: '10px' }}>
      <img 
        src="/logo.png" 
        alt="Logo" 
        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} 
      />
      <h1 className="header-title">{title || 'Sofitel and daughters'}</h1>
    </header>
  );
}
