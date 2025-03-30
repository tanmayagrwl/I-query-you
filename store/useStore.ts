import { create } from "zustand"

interface Query {
  id: string
  name: string
  query: string
  pinned: boolean
  table: string
}

export const useStore = create<{
  queries: Query[]
  tables: {
    [name: string]: unknown[]
  }

  activeQuery: Query | null
  setActiveQuery: (query: Query | null) => void
  addQuery: (query: Query) => void
  removeQuery: (id: string) => void
  TogglePinQuery: (id: string) => void
  addTable: (tableName: string, data: unknown[]) => void
  selectedTable: string
  setSelectedTable: (tableName: string) => void
}>((set) => ({
  queries: [],
  tables: {
    employees: [
      {
        id: 1,
        name: "John Doe",
        age: 30,
        department: "HR",
      },
      {
        id: 2,
        name: "Jane Smith",
        age: 25,
        department: "Finance",
      },
      {
        id: 3,
        name: "Alice Johnson",
        age: 28,
        department: "Engineering",
      },
    ],
    departments: [
      {
        id: 1,
        name: "HR",
      },
      {
        id: 2,
        name: "Finance",
      },
      {
        id: 3,
        name: "Engineering",
      },
    ],
  },
  addTable: (tableName: string, data: unknown[]) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [tableName]: data,
      },
    })),
  activeQuery: null,
  setActiveQuery: (query: Query | null) => set({ activeQuery: query }),
  addQuery: (query: Query) =>
    set((state) => ({
      queries: [...state.queries, query],
    })),

  removeQuery: (id: string) =>
    set((state) => ({
      queries: state.queries.filter((query) => query.id !== id),
    })),
  TogglePinQuery: (id: string) =>
    set((state) => ({
      queries: state.queries.map((query) =>
        query.id === id ? { ...query, pinned: !query.pinned } : query
      ),
    })),
  selectedTable: "",
  setSelectedTable: (tableName: string) => set({ selectedTable: tableName }),
}))
