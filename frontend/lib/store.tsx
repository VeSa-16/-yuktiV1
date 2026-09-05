"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface SessionState {
  sessionId: string | null;
  locationId: string | null;
  locationName: string | null;
  marginCapital: number | null;
  categoryId: string | null;
  categoryName: string | null;
  dataRichness: "rich" | "sparse" | null;
  opportunities: any[];
}

interface StoreContextType {
  state: SessionState;
  updateState: (updates: Partial<SessionState>) => void;
  resetState: () => void;
}

const initialState: SessionState = {
  sessionId: null,
  locationId: null,
  locationName: null,
  marginCapital: null,
  categoryId: null,
  categoryName: null,
  dataRichness: null,
  opportunities: [],
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>(initialState);

  const updateState = (updates: Partial<SessionState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <StoreContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
