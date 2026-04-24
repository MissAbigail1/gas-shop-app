import React from 'react';

export default function Header({ title }) {
  return (
    <header className="header">
      <h1 className="header-title">{title || 'Sofitel and daughters'}</h1>
    </header>
  );
}
