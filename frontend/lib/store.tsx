"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BusinessPlan {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
  score: number;
  status: 'Draft' | 'Planning' | 'Validated';
  locationId: string;
  locationName: string;
  marginCapital: number;
}

export interface SessionState {
  // Current Active Session
  sessionId: string | null;
  locationId: string | null;
  locationName: string | null;
  marginCapital: number | null;
  categoryId: string | null;
  categoryName: string | null;
  dataRichness: "rich" | "sparse" | null;
  opportunities: any[];
  
  // Persistent Profile
  profileName: string;
  preferredLanguage: string;
  savedPlans: BusinessPlan[];

  // Actions
  updateState: (updates: Partial<SessionState>) => void;
  resetState: () => void;
  saveCurrentPlan: () => void;
}

export const useStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      locationId: null,
      locationName: null,
      marginCapital: null,
      categoryId: null,
      categoryName: null,
      dataRichness: null,
      opportunities: [],
      
      profileName: 'Entrepreneur',
      preferredLanguage: 'EN',
      savedPlans: [],

      updateState: (updates) => set((state) => ({ ...state, ...updates })),
      
      resetState: () => set((state) => ({
        sessionId: null,
        locationId: null,
        locationName: null,
        marginCapital: null,
        categoryId: null,
        categoryName: null,
        dataRichness: null,
        opportunities: []
      })),

      saveCurrentPlan: () => {
        const state = get();
        if (!state.categoryId || !state.categoryName || !state.locationName || !state.marginCapital) return;
        
        const newPlan: BusinessPlan = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${state.categoryName} in ${state.locationName}`,
          categoryId: state.categoryId,
          categoryName: state.categoryName,
          createdAt: new Date().toISOString().split('T')[0],
          score: 84, // Will be updated by engine
          status: 'Draft',
          locationId: state.locationId || 'unknown',
          locationName: state.locationName,
          marginCapital: state.marginCapital
        };

        set((s) => ({
          savedPlans: [...s.savedPlans, newPlan]
        }));
      }
    }),
    {
      name: 'yukti-storage', // name of the item in the storage (must be unique)
    }
  )
);

// We keep a dummy provider for compatibility if layout wrapped it
export function StoreProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
