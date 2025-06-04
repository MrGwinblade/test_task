import {
    createSlice,
    type PayloadAction
} from '@reduxjs/toolkit';

import {
    type NodeType,
    type EdgeType,
} from "@/schemas";


interface InitialState {
    nodes: NodeType[];
    edges: EdgeType[];
}

const loadStateFromLocalStorage = (): InitialState => {
  try {
    if (typeof window !== "undefined") {
      const serializedNodes = localStorage.getItem("reactflow-nodes")
      const serializedEdges = localStorage.getItem("reactflow-edges")

      const nodes = serializedNodes ? JSON.parse(serializedNodes) : []
      const edges = serializedEdges ? JSON.parse(serializedEdges) : []

      
      if (Array.isArray(nodes) && Array.isArray(edges)) {
        return { nodes, edges }
      }
    }
  } catch (error) {
    console.warn("Failed to load state from localStorage:", error)
  }

  
  return {
    nodes: [],
    edges: [],
  }
}


const saveStateToLocalStorage = (nodes: NodeType[], edges: EdgeType[]) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem("reactflow-nodes", JSON.stringify(nodes))
      localStorage.setItem("reactflow-edges", JSON.stringify(edges))
    }
  } catch (error) {
    console.warn("Failed to save state to localStorage:", error)
  }
}

const initialState: InitialState = loadStateFromLocalStorage()


const graphSlice = createSlice({
  name: "graph",
  initialState,
  reducers: {
    setNodes: (state, action: PayloadAction<NodeType[]>) => {
      state.nodes = action.payload
      
      saveStateToLocalStorage(action.payload, state.edges)
    },
    setEdges: (state, action: PayloadAction<EdgeType[]>) => {
      state.edges = action.payload
      
      saveStateToLocalStorage(state.nodes, action.payload)
    },
    clearStorage: (state) => {
      state.nodes = []
      state.edges = []
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("reactflow-nodes")
          localStorage.removeItem("reactflow-edges")
        }
      } catch (error) {
        console.warn("Failed to clear localStorage:", error)
      }
    },
    loadFromStorage: (state) => {
      const loadedState = loadStateFromLocalStorage()
      state.nodes = loadedState.nodes
      state.edges = loadedState.edges
    },
  },
})

export const {
    setNodes,
    setEdges,
    clearStorage,
    loadFromStorage,
} = graphSlice.actions;
export default graphSlice.reducer;
