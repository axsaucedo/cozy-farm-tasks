import React, { createContext, useContext, useState, useEffect } from 'react';

interface DebugFlags {
  fastWatering: boolean;
}

interface DebugContextType {
  flags: DebugFlags;
  toggleFlag: (flag: keyof DebugFlags) => void;
  resetFlags: () => void;
}

const DEFAULT_FLAGS: DebugFlags = {
  fastWatering: false,
};

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<DebugFlags>(() => {
    const saved = localStorage.getItem('farmTodoDebugFlags');
    return saved ? { ...DEFAULT_FLAGS, ...JSON.parse(saved) } : DEFAULT_FLAGS;
  });

  useEffect(() => {
    localStorage.setItem('farmTodoDebugFlags', JSON.stringify(flags));
  }, [flags]);

  const toggleFlag = (flag: keyof DebugFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };

  const resetFlags = () => {
    setFlags(DEFAULT_FLAGS);
    localStorage.removeItem('farmTodoDebugFlags');
  };

  return (
    <DebugContext.Provider value={{ flags, toggleFlag, resetFlags }}>
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};