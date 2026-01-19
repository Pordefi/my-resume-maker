// 智能模板转换 - 保留内容，只改变样式
import { CanvasComponent, ComponentType } from '@/types/canvas'

// 识别组件组的类型
export const identifyGroupType = (components: CanvasComponent[]): string | null => {
  // 通过文本内容关键词识别
  const texts = components
    .filter(c => c.type === ComponentType.TEXT)
    .map(c => c.text?.toLowerCase() || '')
    .join(' ')
  
  if (texts.includes('工作') || texts.includes('公司') || texts.includes('职位')) {
    return 'work'
  }
  if (texts.includes('教育') || texts.includes('学校') || texts.includes('大学') || texts.includes('专业')) {
    return 'education'
  }
  if (texts.includes('项目') || texts.includes('开发') || texts.includes('系统')) {
    return 'project'
  }
  if (texts.includes('技能') || texts.includes('掌握')) {
    return 'skills'
  }
  if (texts.includes('简介') || texts.includes('概述')) {
    return 'summary'
  }
  if (texts.includes('联系') || texts.includes('电话') || texts.includes('邮箱')) {
    return 'contact'
  }
  if (texts.includes('姓名') || texts.includes('求职')) {
    return 'header'
  }
  if (texts.includes('荣誉') || texts.includes('奖项') || texts.includes('证书')) {
    return 'awards'
  }
  if (texts.includes('语言') || texts.includes('英语') || texts.includes('日语')) {
    return 'languages'
  }
  
  return null
}

// 提取组件组的文本内容
export const extractGroupContent = (components: CanvasComponent[]): Record<string, string> => {
  const content: Record<string, string> = {}
  
  components.forEach((comp, index) => {
    if (comp.type === ComponentType.TEXT && comp.text) {
      content[`text_${index}`] = comp.text
    }
  })
  
  return content
}

// 将内容应用到新模板
export const applyContentToTemplate = (
  templateComponents: CanvasComponent[],
  content: Record<string, string>
): CanvasComponent[] => {
  const textComponents = templateComponents.filter(c => c.type === ComponentType.TEXT)
  const contentValues = Object.values(content)
  
  // 将提取的文本按顺序填充到新模板的文本组件中
  textComponents.forEach((comp, index) => {
    if (index < contentValues.length && contentValues[index]) {
      comp.text = contentValues[index]
    }
  })
  
  return templateComponents
}

// 分析画布内容结构
export interface ContentStructure {
  header?: Record<string, string>
  contact?: Record<string, string>
  summary?: Record<string, string>
  skills?: Record<string, string>
  work: Array<Record<string, string>>
  education: Array<Record<string, string>>
  projects: Array<Record<string, string>>
  awards?: Record<string, string>
  languages?: Record<string, string>
}

export const analyzeCanvasContent = (
  components: CanvasComponent[],
  groups: any[]
): ContentStructure => {
  const structure: ContentStructure = {
    work: [],
    education: [],
    projects: [],
  }
  
  // 分析每个组
  groups.forEach(group => {
    const groupComponents = components.filter(c => c.groupId === group.id)
    const groupType = identifyGroupType(groupComponents)
    const content = extractGroupContent(groupComponents)
    
    if (groupType === 'work') {
      structure.work.push(content)
    } else if (groupType === 'education') {
      structure.education.push(content)
    } else if (groupType === 'project') {
      structure.projects.push(content)
    } else if (groupType === 'skills') {
      structure.skills = content
    } else if (groupType === 'summary') {
      structure.summary = content
    } else if (groupType === 'contact') {
      structure.contact = content
    } else if (groupType === 'header') {
      structure.header = content
    } else if (groupType === 'awards') {
      structure.awards = content
    } else if (groupType === 'languages') {
      structure.languages = content
    }
  })
  
  // 分析未分组的组件
  const ungroupedComponents = components.filter(c => !c.groupId)
  if (ungroupedComponents.length > 0) {
    const groupType = identifyGroupType(ungroupedComponents)
    const content = extractGroupContent(ungroupedComponents)
    
    if (groupType && !structure[groupType as keyof ContentStructure]) {
      (structure as any)[groupType] = content
    }
  }
  
  return structure
}
