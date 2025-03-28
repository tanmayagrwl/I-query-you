import { create } from 'zustand'

interface Query {
    id: string;
    query: string;
    pinned: boolean;
    table: string;
}

export const useStore = create<{
    queries: Query[];
    addQuery: (query: Query) => void;
    removeQuery: (id: string) => void;
    TogglePinQuery: (id: string) => void;
}>((set) => ({
    queries: [],
    
    addQuery: (query: Query) => set((state) => ({
        queries: [...state.queries, query]
    })),
    
    removeQuery: (id: string) => set((state) => ({
        queries: state.queries.filter(query => query.id !== id)
    })),
    TogglePinQuery: (id: string) => set((state) => ({
        queries: state.queries.map(query => query.id === id ? { ...query, pinned: !query.pinned } : query)
    }))
}))