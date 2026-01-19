import { create } from 'zustand'
import { CanvasComponent, CanvasState, CanvasSize, CANVAS_CONFIGS } from '@/types/canvas'

interface CanvasStore extends CanvasState {
  // 组件操作
  addComponent: (component: CanvasComponent) => void
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void
  deleteComponent: (id: string) => void
  deleteSelectedComponents: () => void
  
  // 选择操作
  selectComponent: (id: string, multi?: boolean) => void
  clearSelection: () => void
  selectAll: () => void
  
  // 层级操作
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
  bringForward: (id: string) => void
  sendBackward: (id: string) => void
  
  // 剪贴板操作
  copy: () => void
  paste: () => void
  cut: () => void
  
  // 历史操作
  undo: () => void
  redo: () => void
  saveHistory: () => void
  
  // 视图操作
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleRuler: () => void
  setCanvasSize: (size: CanvasSize) => void
  setCanvasBackgroundColor: (color: string) => void
  
  // 批量操作
  alignComponents: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void
  distributeComponents: (type: 'horizontal' | 'vertical') => void
  
  // 导入导出
  loadTemplate: (components: CanvasComponent[]) => void
  clearCanvas: () => void
}

const initialState: CanvasState = {
  components: [],
  selectedIds: [],
  clipboard: [],
  history: [[]],
  historyIndex: 0,
  zoom: 1,
  showGrid: true,
  showRuler: true,
  canvasSize: CanvasSize.A4,
  canvasWidth: CANVAS_CONFIGS[CanvasSize.A4].width,
  canvasHeight: CANVAS_CONFIGS[CanvasSize.A4].height,
  canvasBackgroundColor: '#ffffff',
}

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...initialState,

  addComponent: (component) => {
    set((state) => {
      const newComponents = [...state.components, component]
      return { components: newComponents }
    })
    get().saveHistory()
  },

  updateComponent: (id, updates) => {
    set((state) => ({
      components: state.components.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }))
  },

  deleteComponent: (id) => {
    set((state) => ({
      components: state.components.filter((c) => c.id !== id),
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    }))
    get().saveHistory()
  },

  deleteSelectedComponents: () => {
    const { selectedIds } = get()
    set((state) => ({
      components: state.components.filter((c) => !selectedIds.includes(c.id)),
      selectedIds: [],
    }))
    get().saveHistory()
  },

  selectComponent: (id, multi = false) => {
    set((state) => {
      if (multi) {
        const isSelected = state.selectedIds.includes(id)
        return {
          selectedIds: isSelected
            ? state.selectedIds.filter((sid) => sid !== id)
            : [...state.selectedIds, id],
        }
      }
      return { selectedIds: [id] }
    })
  },

  clearSelection: () => set({ selectedIds: [] }),

  selectAll: () => {
    set((state) => ({
      selectedIds: state.components.map((c) => c.id),
    }))
  },

  bringToFront: (id) => {
    set((state) => {
      const maxZIndex = Math.max(...state.components.map((c) => c.zIndex), 0)
      return {
        components: state.components.map((c) =>
          c.id === id ? { ...c, zIndex: maxZIndex + 1 } : c
        ),
      }
    })
  },

  sendToBack: (id) => {
    set((state) => {
      const minZIndex = Math.min(...state.components.map((c) => c.zIndex), 0)
      return {
        components: state.components.map((c) =>
          c.id === id ? { ...c, zIndex: minZIndex - 1 } : c
        ),
      }
    })
  },

  bringForward: (id) => {
    set((state) => {
      const component = state.components.find((c) => c.id === id)
      if (!component) return state
      
      const higherComponents = state.components.filter(
        (c) => c.zIndex > component.zIndex
      )
      if (higherComponents.length === 0) return state
      
      const nextZIndex = Math.min(...higherComponents.map((c) => c.zIndex))
      return {
        components: state.components.map((c) =>
          c.id === id ? { ...c, zIndex: nextZIndex + 1 } : c
        ),
      }
    })
  },

  sendBackward: (id) => {
    set((state) => {
      const component = state.components.find((c) => c.id === id)
      if (!component) return state
      
      const lowerComponents = state.components.filter(
        (c) => c.zIndex < component.zIndex
      )
      if (lowerComponents.length === 0) return state
      
      const prevZIndex = Math.max(...lowerComponents.map((c) => c.zIndex))
      return {
        components: state.components.map((c) =>
          c.id === id ? { ...c, zIndex: prevZIndex - 1 } : c
        ),
      }
    })
  },

  copy: () => {
    const { components, selectedIds } = get()
    const selectedComponents = components.filter((c) =>
      selectedIds.includes(c.id)
    )
    set({ clipboard: selectedComponents })
  },

  paste: () => {
    const { clipboard } = get()
    if (clipboard.length === 0) return

    const newComponents = clipboard.map((c) => ({
      ...c,
      id: `${c.type}-${Date.now()}-${Math.random()}`,
      x: c.x + 20,
      y: c.y + 20,
    }))

    set((state) => ({
      components: [...state.components, ...newComponents],
      selectedIds: newComponents.map((c) => c.id),
    }))
    get().saveHistory()
  },

  cut: () => {
    get().copy()
    get().deleteSelectedComponents()
  },

  saveHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(state.components)))
      return {
        history: newHistory.slice(-50), // 保留最近50步
        historyIndex: Math.min(newHistory.length - 1, 49),
      }
    })
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state
      const newIndex = state.historyIndex - 1
      return {
        components: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
        selectedIds: [],
      }
    })
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state
      const newIndex = state.historyIndex + 1
      return {
        components: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
        selectedIds: [],
      }
    })
  },

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  toggleRuler: () => set((state) => ({ showRuler: !state.showRuler })),

  setCanvasSize: (size) => {
    const config = CANVAS_CONFIGS[size]
    set({
      canvasSize: size,
      canvasWidth: config.width,
      canvasHeight: config.height,
    })
  },

  setCanvasBackgroundColor: (color) => set({ canvasBackgroundColor: color }),

  alignComponents: (type) => {
    const { components, selectedIds } = get()
    if (selectedIds.length < 2) return

    const selectedComponents = components.filter((c) =>
      selectedIds.includes(c.id)
    )

    let updates: Record<string, Partial<CanvasComponent>> = {}

    switch (type) {
      case 'left': {
        const minX = Math.min(...selectedComponents.map((c) => c.x))
        selectedIds.forEach((id) => {
          updates[id] = { x: minX }
        })
        break
      }
      case 'center': {
        const avgX =
          selectedComponents.reduce((sum, c) => sum + c.x + c.width / 2, 0) /
          selectedComponents.length
        selectedIds.forEach((id) => {
          const comp = components.find((c) => c.id === id)!
          updates[id] = { x: avgX - comp.width / 2 }
        })
        break
      }
      case 'right': {
        const maxX = Math.max(...selectedComponents.map((c) => c.x + c.width))
        selectedIds.forEach((id) => {
          const comp = components.find((c) => c.id === id)!
          updates[id] = { x: maxX - comp.width }
        })
        break
      }
      case 'top': {
        const minY = Math.min(...selectedComponents.map((c) => c.y))
        selectedIds.forEach((id) => {
          updates[id] = { y: minY }
        })
        break
      }
      case 'middle': {
        const avgY =
          selectedComponents.reduce((sum, c) => sum + c.y + c.height / 2, 0) /
          selectedComponents.length
        selectedIds.forEach((id) => {
          const comp = components.find((c) => c.id === id)!
          updates[id] = { y: avgY - comp.height / 2 }
        })
        break
      }
      case 'bottom': {
        const maxY = Math.max(...selectedComponents.map((c) => c.y + c.height))
        selectedIds.forEach((id) => {
          const comp = components.find((c) => c.id === id)!
          updates[id] = { y: maxY - comp.height }
        })
        break
      }
    }

    set((state) => ({
      components: state.components.map((c) =>
        updates[c.id] ? { ...c, ...updates[c.id] } : c
      ),
    }))
    get().saveHistory()
  },

  distributeComponents: (type) => {
    const { components, selectedIds } = get()
    if (selectedIds.length < 3) return

    const selectedComponents = components
      .filter((c) => selectedIds.includes(c.id))
      .sort((a, b) => (type === 'horizontal' ? a.x - b.x : a.y - b.y))

    const first = selectedComponents[0]
    const last = selectedComponents[selectedComponents.length - 1]

    if (type === 'horizontal') {
      const totalWidth = last.x + last.width - first.x
      const totalComponentWidth = selectedComponents.reduce(
        (sum, c) => sum + c.width,
        0
      )
      const gap = (totalWidth - totalComponentWidth) / (selectedComponents.length - 1)

      let currentX = first.x
      selectedComponents.forEach((comp, index) => {
        if (index > 0 && index < selectedComponents.length - 1) {
          get().updateComponent(comp.id, { x: currentX })
        }
        currentX += comp.width + gap
      })
    } else {
      const totalHeight = last.y + last.height - first.y
      const totalComponentHeight = selectedComponents.reduce(
        (sum, c) => sum + c.height,
        0
      )
      const gap = (totalHeight - totalComponentHeight) / (selectedComponents.length - 1)

      let currentY = first.y
      selectedComponents.forEach((comp, index) => {
        if (index > 0 && index < selectedComponents.length - 1) {
          get().updateComponent(comp.id, { y: currentY })
        }
        currentY += comp.height + gap
      })
    }

    get().saveHistory()
  },

  loadTemplate: (components) => {
    set({
      components: JSON.parse(JSON.stringify(components)),
      selectedIds: [],
    })
    get().saveHistory()
  },

  clearCanvas: () => {
    set({
      components: [],
      selectedIds: [],
      clipboard: [],
    })
    get().saveHistory()
  },
}))
