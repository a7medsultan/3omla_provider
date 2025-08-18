import React, { createContext, useState, useContext, useEffect } from 'react';

interface DirectionContextType {
  direction: 'ltr' | 'rtl';
  toggleDirection: () => void;
}

const DirectionContext = createContext<DirectionContextType | undefined>(undefined);

export const DirectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr'); // Default direction

  const toggleDirection = () => {
    setDirection((prevDirection) => (prevDirection === 'ltr' ? 'rtl' : 'ltr'));
  };

  // Optional: Persist direction in local storage
  useEffect(() => {
    const storedDirection = localStorage.getItem('appDirection');
    if (storedDirection === 'rtl' || storedDirection === 'ltr') {
      setDirection(storedDirection);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appDirection', direction);
    document.documentElement.setAttribute('dir', direction); // Apply to the root element
  }, [direction]);

  return (
    <DirectionContext.Provider value={{ direction, toggleDirection }}>
      {children}
    </DirectionContext.Provider>
  );
};

export const useDirection = (): DirectionContextType => {
  const context = useContext(DirectionContext);
  if (!context) {
    throw new Error('useDirection must be used within a DirectionProvider');
  }
  return context;
};