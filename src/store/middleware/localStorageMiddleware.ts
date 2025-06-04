import { createListenerMiddleware } from "@reduxjs/toolkit"
import { setNodes, setEdges } from "../slices/graphSlice"


export const localStorageMiddleware = createListenerMiddleware()

// Задержка
let saveTimeout: NodeJS.Timeout | null = null

localStorageMiddleware.startListening({
  actionCreator: setNodes,
  effect: (action, listenerApi) => {
    
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      const state = listenerApi.getState() as any
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("reactflow-nodes", JSON.stringify(state.graph.nodes))
          console.log("Nodes saved to localStorage")
        }
      } catch (error) {
        console.warn("Failed to save nodes to localStorage:", error)
      }
    }, 100) // Сохраняем через 100мс после последнего изменения
  },
})

localStorageMiddleware.startListening({
  actionCreator: setEdges,
  effect: (action, listenerApi) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }

    saveTimeout = setTimeout(() => {
      const state = listenerApi.getState() as any
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("reactflow-edges", JSON.stringify(state.graph.edges))
          console.log("Edges saved to localStorage")
        }
      } catch (error) {
        console.warn("Failed to save edges to localStorage:", error)
      }
    }, 100)
  },
})
