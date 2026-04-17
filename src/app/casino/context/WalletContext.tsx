"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface WalletContextType {
  balance: number;
  addFunds: (amount: number) => void;
  deductFunds: (amount: number) => boolean;
  resetWallet: () => void;
}

const INITIAL_BALANCE = 1000;
const STORAGE_KEY = "casino-wallet-balance";

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setBalance(parsed);
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, String(balance));
    }
  }, [balance, loaded]);

  const addFunds = useCallback((amount: number) => {
    setBalance((prev) => prev + amount);
  }, []);

  const deductFunds = useCallback((amount: number): boolean => {
    let success = false;
    setBalance((prev) => {
      if (prev >= amount) {
        success = true;
        return prev - amount;
      }
      return prev;
    });
    return success;
  }, []);

  const resetWallet = useCallback(() => {
    setBalance(INITIAL_BALANCE);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <WalletContext.Provider value={{ balance, addFunds, deductFunds, resetWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
