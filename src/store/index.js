import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useMedicalStore = create(
  persist(
    (set) => ({
      medicalProfile: null,
      conversations: [],
      uploadedFiles: [],
      
      setMedicalProfile: (profile) => set({ medicalProfile: profile }),
      addConversation: (conversation) => 
        set((state) => ({ 
          conversations: [conversation, ...state.conversations] 
        })),
      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map(conv =>
            conv.id === id ? { ...conv, ...updates } : conv
          ),
        })),
      addUploadedFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file],
        })),
      clearMedicalData: () => set({ medicalProfile: null, conversations: [], uploadedFiles: [] }),
    }),
    {
      name: 'medical-storage',
    }
  )
);

export const useUIStore = create((set) => ({
  currentAgent: 'general',
  isSidebarOpen: true,
  theme: 'light',
  language: 'ar',
  
  setCurrentAgent: (agent) => set({ currentAgent: agent }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
}));

export const useSubscriptionStore = create(
  persist(
    (set) => ({
      currentPlan: 'free',
      subscriptionStatus: 'active',
      renewalDate: null,
      
      setPlan: (plan) => set({ currentPlan: plan }),
      updateSubscription: (status, renewalDate) => 
        set({ subscriptionStatus: status, renewalDate }),
    }),
    {
      name: 'subscription-storage',
    }
  )
);
