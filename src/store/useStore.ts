import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Nominee } from '../types';

interface Store {
  currentUser: User | null;
  nominees: Nominee[];
  setCurrentUser: (user: User | null) => void;
  addNomination: (nominee: Omit<Nominee, 'id' | 'votes' | 'timestamp' | 'approved'>) => void;
  getUserNominations: () => Nominee[];
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null,
      nominees: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      addNomination: (nominee) => {
        const newNominee: Nominee = {
          id: crypto.randomUUID(),
          votes: 0,
          timestamp: new Date(),
          approved: false,
          ...nominee,
        };
        set((state) => ({
          nominees: [...state.nominees, newNominee],
          currentUser: state.currentUser
            ? {
                ...state.currentUser,
                nominations: [...state.currentUser.nominations, newNominee.id],
              }
            : null,
        }));
      },
      getUserNominations: () => {
        const { currentUser, nominees } = get();
        return currentUser
          ? nominees.filter((n) => currentUser.nominations.includes(n.id))
          : [];
      },
    }),
    {
      name: 'gauntlet-store',
    }
  )
);