import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'portfolio-data';
const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    fetch('/portfolio-data.json')
      .then(r => r.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Called by admin forms to persist a section change
  const updateSection = useCallback((section, value) => {
    setData(prev => {
      const next = { ...prev, [section]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // Download current data as portfolio-data.json
  const exportJSON = useCallback(() => {
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  // Clear localStorage so the next load re-fetches from portfolio-data.json
  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }, []);

  return (
    <PortfolioContext.Provider value={{ ...data, loading, updateSection, exportJSON, resetToDefault }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => useContext(PortfolioContext);
