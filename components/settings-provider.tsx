"use client";

import { createContext, useContext } from "react";

const LowStockContext = createContext(5);

export function SettingsProvider({
  lowStockThreshold,
  children,
}: {
  lowStockThreshold: number;
  children: React.ReactNode;
}) {
  return (
    <LowStockContext.Provider value={lowStockThreshold}>
      {children}
    </LowStockContext.Provider>
  );
}

export function useLowStockThreshold() {
  return useContext(LowStockContext);
}
