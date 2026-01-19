import { create } from 'zustand'
import { CanvasComponent, CanvasState, CanvasSize, CANVAS_CONFIGS, Page, ComponentGroup } from '@/types/canvas'

interface CanvasStore extends CanvasState {
  // 页面操作
  addPage: () => void
  deletePage: (id: string) => void
  switchPage: (id: string) => void
  renamePage: (id: string, name: string) => void
  duplicatePage: (id: string) => void
  
  // 组操作
  createGroup: (name?: string) => void
  ungroupComponents: (groupId: string) => void
  addToGroup: (groupId: string, componentIds: string[]) => void
  removeFromGroup: (componentIds: string[]) => void
  toggleGroupLock: (groupId: string) => void
  toggleGroupVisibility: (groupId: string) => void
  getComponentGroup: (componentId: string) => ComponentGroup | undefined
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

const createInitialPage = (): Page => ({
  id: `page-${Date.now()}`,
  name: '页面 1',
  components: [],
  backgroundColor: '#ffffff',
})

const initialState: CanvasState = {
  pages: [createInitialPage()],
  currentPageId: '',
  components: [],
  groups: [],
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

// 初始化 currentPageId
initialState.currentPageId = initialState.pages[0].id
initialState.components = initialState.pages[0].components
initialState.canvasBackgroundColor = initialState.pages[0].backgroundColor

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  ...initialState,

  // 页面操作
  addPage: () => {
    set((state) => {
      const newPage: Page = {
        id: `page-${Date.now()}`,
        name: `页面 ${state.pages.length + 1}`,
        components: [],
        backgroundColor: '#ffffff',
      }
      return {
        pages: [...state.pages, newPage],
        currentPageId: newPage.id,
        components: [],
        canvasBackgroundColor: newPage.backgroundColor,
        selectedIds: [],
      }
    })
  },

  deletePage: (id) => {
    set((state) => {
      if (state.pages.length <= 1) return state
      
      const newPages = state.pages.filter((p) => p.id !== id)
      const wasCurrentPage = state.currentPageId === id
      const newCurrentPageId = wasCurrentPage ? newPages[0].id : state.currentPageId
      const currentPage = newPages.find((p) => p.id === newCurrentPageId)!
      
      return {
        pages: newPages,
        currentPageId: newCurrentPageId,
        components: currentPage.components,
        canvasBackgroundColor: currentPage.backgroundColor,
        selectedIds: [],
      }
    })
  },

  switchPage: (id) => {
    set((state) => {
      // 保存当前页面的组件
      const updatedPages = state.pages.map((p) =>
        p.id === state.currentPageId
          ? { ...p, components: state.components, backgroundColor: state.canvasBackgroundColor }
          : p
      )
      
      const targetPage = updatedPages.find((p) => p.id === id)
      if (!targetPage) return state
      
      return {
        pages: updatedPages,
        currentPageId: id,
        components: [...targetPage.components],
        canvasBackgroundColor: targetPage.backgroundColor,
        selectedIds: [],
      }
    })
  },

  renamePage: (id, name) => {
    set((state) => ({
      pages: state.pages.map((p) => (p.id === id ? { ...p, name } : p)),
    }))
  },

  duplicatePage: (id) => {
    set((state) => {
      const sourcePage = state.pages.find((p) => p.id === id)
      if (!sourcePage) return state
      
      const newPage: Page = {
        id: `page-${Date.now()}`,
        name: `${sourcePage.name} (副本)`,
        components: JSON.parse(JSON.stringify(sourcePage.components)),
        backgroundColor: sourcePage.backgroundColor,
      }
      
      return {
        pages: [...state.pages, newPage],
      }
    })
  },

  // 组操作
  createGroup: (name) => {
    set((state) => {
      const { selectedIds } = state
      if (selectedIds.length < 2) return state

      const groupId = `group-${Date.now()}`
      const groupName = name || `组 ${state.groups.length + 1}`

      const newGroup: ComponentGroup = {
        id: groupId,
        name: groupName,
        componentIds: [...selectedIds],
        locked: false,
        visible: true,
      }

      // 更新组件的 groupId
      const updatedComponents = state.components.map((c) =>
        selectedIds.includes(c.id) ? { ...c, groupId } : c
      )

      return {
        groups: [...state.groups, newGroup],
        components: updatedComponents,
      }
    })
    get().saveHistory()
  },

  ungroupComponents: (groupId) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId)
      if (!group) return state

      // 移除组件的 groupId
      const updatedComponents = state.components.map((c) =>
        group.componentIds.includes(c.id) ? { ...c, groupId: undefined } : c
      )

      return {
        groups: state.groups.filter((g) => g.id !== groupId),
        components: updatedComponents,
      }
    })
    get().saveHistory()
  },

  addToGroup: (groupId, componentIds) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId)
      if (!group) return state

      const updatedGroup = {
        ...group,
        componentIds: [...new Set([...group.componentIds, ...componentIds])],
      }

      const updatedComponents = state.components.map((c) =>
        componentIds.includes(c.id) ? { ...c, groupId } : c
      )

      return {
        groups: state.groups.map((g) => (g.id === groupId ? updatedGroup : g)),
        components: updatedComponents,
      }
    })
  },

  removeFromGroup: (componentIds) => {
    set((state) => {
      const updatedComponents = state.components.map((c) =>
        componentIds.includes(c.id) ? { ...c, groupId: undefined } : c
      )

      const updatedGroups = state.groups
        .map((g) => ({
          ...g,
          componentIds: g.componentIds.filter((id) => !componentIds.includes(id)),
        }))
        .filter((g) => g.componentIds.length >= 2) // 移除少于2个组件的组

      return {
        groups: updatedGroups,
        components: updatedComponents,
      }
    })
  },

  toggleGroupLock: (groupId) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId)
      if (!group) return state

      const newLocked = !group.locked

      // 更新组和组内所有组件的锁定状态
      const updatedComponents = state.components.map((c) =>
        group.componentIds.includes(c.id) ? { ...c, locked: newLocked } : c
      )

      return {
        groups: state.groups.map((g) =>
          g.id === groupId ? { ...g, locked: newLocked } : g
        ),
        components: updatedComponents,
      }
    })
  },

  toggleGroupVisibility: (groupId) => {
    set((state) => {
      const group = state.groups.find((g) => g.id === groupId)
      if (!group) return state

      const newVisible = !group.visible

      // 更新组和组内所有组件的可见性
      const updatedComponents = state.components.map((c) =>
        group.componentIds.includes(c.id) ? { ...c, visible: newVisible } : c
      )

      return {
        groups: state.groups.map((g) =>
          g.id === groupId ? { ...g, visible: newVisible } : g
        ),
        components: updatedComponents,
      }
    })
  },

  getComponentGroup: (componentId) => {
    const state = get()
    const component = state.components.find((c) => c.id === componentId)
    if (!component?.groupId) return undefined
    return state.groups.find((g) => g.id === component.groupId)
  },

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
      const component = state.components.find((c) => c.id === id)
      if (!component) return state

      // 如果组件属于某个组，选择整个组
      if (component.groupId) {
        const group = state.groups.find((g) => g.id === component.groupId)
        if (group) {
          if (multi) {
            const allSelected = group.componentIds.every((cid) =>
              state.selectedIds.includes(cid)
            )
            if (allSelected) {
              // 取消选择整个组
              return {
                selectedIds: state.selectedIds.filter(
                  (sid) => !group.componentIds.includes(sid)
                ),
              }
            } else {
              // 选择整个组
              return {
                selectedIds: [...new Set([...state.selectedIds, ...group.componentIds])],
              }
            }
          } else {
            // 选择整个组
            return { selectedIds: [...group.componentIds] }
          }
        }
      }

      // 普通选择逻辑
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

  setCanvasBackgroundColor: (color) => {
    set((state) => {
      // 同时更新当前页面的背景色
      const updatedPages = state.pages.map((p) =>
        p.id === state.currentPageId ? { ...p, backgroundColor: color } : p
      )
      return {
        canvasBackgroundColor: color,
        pages: updatedPages,
      }
    })
  },

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

// 在切换页面时自动保存当前页面
useCanvasStore.subscribe((state, prevState) => {
  if (state.currentPageId !== prevState.currentPageId) {
    // 页面切换时保存历史
    state.saveHistory()
  }
})
