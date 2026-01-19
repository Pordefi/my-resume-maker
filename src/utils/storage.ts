import { CanvasComponent, Template, CanvasState, Page, ComponentGroup, GuideLine } from '@/types/canvas'

const STORAGE_KEYS = {
  AUTOSAVE: 'resume_designer_autosave',
  TEMPLATES: 'resume_designer_templates',
} as const

// 完整状态导出数据结构
export interface ExportData {
  version: string
  exportDate: number
  pages: Page[]
  currentPageId: string
  groups: ComponentGroup[]
  guides: GuideLine[]
  showGuides: boolean
  canvasSize: string
  canvasWidth: number
  canvasHeight: number
  metadata?: {
    title?: string
    description?: string
    author?: string
  }
}

// 自动保存
export const saveToLocalStorage = (components: CanvasComponent[]) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.AUTOSAVE,
      JSON.stringify({
        components,
        timestamp: Date.now(),
      })
    )
  } catch (error) {
    console.error('保存失败:', error)
  }
}

export const loadFromLocalStorage = (): CanvasComponent[] | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.AUTOSAVE)
    if (!data) return null
    
    const parsed = JSON.parse(data)
    return parsed.components
  } catch (error) {
    console.error('加载失败:', error)
    return null
  }
}

// 模板管理
export const saveTemplate = (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const templates = getTemplates()
    const newTemplate: Template = {
      ...template,
      id: `template-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    templates.push(newTemplate)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
    
    return newTemplate
  } catch (error) {
    console.error('保存模板失败:', error)
    throw error
  }
}

export const getTemplates = (): Template[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('获取模板失败:', error)
    return []
  }
}

export const deleteTemplate = (id: string) => {
  try {
    const templates = getTemplates().filter((t) => t.id !== id)
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
  } catch (error) {
    console.error('删除模板失败:', error)
    throw error
  }
}

// 导出完整状态到JSON
export const exportFullStateToJSON = (state: Partial<CanvasState>, metadata?: ExportData['metadata']) => {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: Date.now(),
    pages: state.pages || [],
    currentPageId: state.currentPageId || '',
    groups: state.groups || [],
    guides: state.guides || [],
    showGuides: state.showGuides ?? true,
    canvasSize: state.canvasSize || 'a4',
    canvasWidth: state.canvasWidth || 794,
    canvasHeight: state.canvasHeight || 1123,
    metadata: metadata || {
      title: '简历设计',
      description: '使用简历设计工具创建',
      author: '',
    },
  }
  
  const data = JSON.stringify(exportData, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `resume-design-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 导入完整状态从JSON
export const importFullStateFromJSON = (file: File): Promise<ExportData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as ExportData
        
        // 验证数据格式
        if (!data.pages || !Array.isArray(data.pages)) {
          reject(new Error('无效的JSON格式：缺少pages字段'))
          return
        }
        
        resolve(data)
      } catch (error) {
        reject(new Error('JSON格式错误'))
      }
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}

// 兼容旧版本：导出组件列表（仅当前页面）
export const exportToJSON = (components: CanvasComponent[]) => {
  const data = JSON.stringify(components, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `resume-${Date.now()}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// 兼容旧版本：导入组件列表
export const importFromJSON = (file: File): Promise<CanvasComponent[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('JSON格式错误'))
      }
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}
