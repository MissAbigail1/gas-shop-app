import React, { useState } from 'react';
import { Lock } from 'lucide-react';

export default function PinLock({ onUnlock, correctPin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handlePress = (num) => {
    if (pin.length >= 4) return;
    
    const newPin = pin + num;
    setPin(newPin);
    
    if (newPin.length === 4) {
      if (newPin === correctPin) {
        // Correct PIN entered!
        localStorage.setItem('gasShopUnlocked', 'true');
        onUnlock();
      } else {
        // Wrong PIN
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 800);
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--primary)' }}>
      
      <div style={{ color: 'white', marginBottom: '32px' }}>
        <Lock size={48} />
      </div>
      
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 700, marginBottom: '32px' }}>
        Shop Manager
      </h2>

      {/* Pin Dots */}
      <div className={error ? "shake" : ""} style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
        {[0, 1, 2, 3].map((index) => (
          <div 
            key={index}
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: pin.length > index ? 'white' : 'transparent',
              border: '2px solid white',
              transition: 'background-color 0.1s'
            }}
          />
        ))}
      </div>

      {/* Number Pad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '300px' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button 
            key={num}
            onClick={() => handlePress(num.toString())}
            style={{
              width: '72px', height: '72px', borderRadius: '36px',
              backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', fontSize: '28px', fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {num}
          </button>
        ))}
        <div /> {/* Empty space bottom left */}
        <button 
          onClick={() => handlePress('0')}
          style={{
            width: '72px', height: '72px', borderRadius: '36px',
            backgroundColor: 'rgba(255,255,255,0.1)', border: 'none',
            color: 'white', fontSize: '28px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          0
        </button>
        <button 
          onClick={handleDelete}
          style={{
            width: '72px', height: '72px', borderRadius: '36px',
            backgroundColor: 'transparent', border: 'none',
            color: 'rgba(255,255,255,0.7)', fontSize: '16px', fontWeight: 600,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          DEL
        </button>
      </div>

      <style>
        {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          .shake { animation: shake 0.4s; }
        `}
      </style>
    </div>
  );
}
