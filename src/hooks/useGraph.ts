import {useAppDispatch} from "./useAppDispatch";
import {useAppSelector} from "./useAppSelector";

import {
    setNodes as setNodesAction,
    setEdges as setEdgesAction,
    clearStorage,
  loadFromStorage,
} from "@/store/slices/graphSlice.ts";

import {
    type NodeType,
    type EdgeType
} from "@/schemas";
import { useCallback, useEffect } from "react";


export const useGraph = () => {
  const dispatch = useAppDispatch()

  const nodes = useAppSelector((state) => state.graph.nodes)
  const edges = useAppSelector((state) => state.graph.edges)

  
  useEffect(() => {
    
    if (typeof window !== "undefined") {
      const hasStoredNodes = localStorage.getItem("reactflow-nodes")
      if (hasStoredNodes && nodes.length === 0) {
        dispatch(loadFromStorage())
      }
    }
  }, [dispatch, nodes.length])

  const setNodes = (newNodes: NodeType[]) => {
    dispatch(setNodesAction(newNodes))
  }

  const setEdges = (newEdges: EdgeType[]) => {
    dispatch(setEdgesAction(newEdges))
  }

  const clearStoredData = () => {
    dispatch(clearStorage())
  }


  return {
    nodes,
    edges,
    setNodes,
    setEdges,
    clearStoredData,
  }
}
