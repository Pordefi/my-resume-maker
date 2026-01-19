import { CanvasComponent } from '@/types/canvas'
import {
  createTextComponent,
  createShapeComponent,
  createLineComponent,
  createIconComponent,
} from './componentFactory'
import { ShapeType } from '@/types/canvas'

// ==================== 简历头部模板 ====================

// 样式1: 经典居中
export const createResumeHeader1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const name = createTextComponent(297, 50, '张三')
  name.fontSize = 36
  name.fontWeight = 'bold'
  name.color = '#1f2937'
  name.textAlign = 'center'
  name.width = 200
  components.push(name)
  
  const title = createTextComponent(297, 100, '高级前端工程师')
  title.fontSize = 18
  title.color = '#6b7280'
  title.textAlign = 'center'
  title.width = 200
  components.push(title)
  
  const line = createLineComponent(247, 140, true)
  line.width = 300
  line.points = [0, 0, 300, 0]
  line.stroke = '#3b82f6'
  line.strokeWidth = 3
  components.push(line)
  
  return components
}

// 样式2: 左对齐带装饰
export const createResumeHeader2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const accent = createShapeComponent(50, 40, ShapeType.RECTANGLE)
  accent.width = 6
  accent.height = 80
  accent.fill = '#3b82f6'
  accent.stroke = 'transparent'
  accent.borderRadius = 3
  components.push(accent)
  
  const name = createTextComponent(70, 45, '张三')
  name.fontSize = 32
  name.fontWeight = 'bold'
  name.color = '#1f2937'
  components.push(name)
  
  const title = createTextComponent(70, 90, '高级前端工程师')
  title.fontSize = 16
  title.color = '#6b7280'
  components.push(title)
  
  return components
}

// 样式3: 带背景色
export const createResumeHeader3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const bg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  bg.width = 794
  bg.height = 120
  bg.fill = '#1f2937'
  bg.stroke = 'transparent'
  components.push(bg)
  
  const name = createTextComponent(50, 30, '张三')
  name.fontSize = 36
  name.fontWeight = 'bold'
  name.color = '#ffffff'
  components.push(name)
  
  const title = createTextComponent(50, 75, '高级前端工程师')
  title.fontSize = 18
  title.color = '#d1d5db'
  components.push(title)
  
  return components
}

// ==================== 联系信息模板 ====================

// 样式1: 横向排列
export const createContactInfo1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const startY = 150
  const gap = 180
  
  const contacts = [
    { icon: 'phone', text: '138-0000-0000' },
    { icon: 'email', text: 'example@email.com' },
    { icon: 'location', text: '北京市朝阳区' },
    { icon: 'link', text: 'github.com/username' },
  ]
  
  contacts.forEach((contact, index) => {
    const icon = createIconComponent(50 + index * gap, startY, contact.icon)
    icon.width = 18
    icon.height = 18
    icon.color = '#3b82f6'
    components.push(icon)
    
    const text = createTextComponent(75 + index * gap, startY - 3, contact.text)
    text.fontSize = 12
    text.color = '#4b5563'
    components.push(text)
  })
  
  return components
}

// 样式2: 纵向列表
export const createContactInfo2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const startY = 150
  const lineHeight = 35
  
  const contacts = [
    { icon: 'phone', label: '电话', text: '138-0000-0000' },
    { icon: 'email', label: '邮箱', text: 'example@email.com' },
    { icon: 'location', label: '地址', text: '北京市朝阳区' },
    { icon: 'link', label: '网站', text: 'github.com/username' },
  ]
  
  contacts.forEach((contact, index) => {
    const icon = createIconComponent(50, startY + index * lineHeight, contact.icon)
    icon.width = 20
    icon.height = 20
    icon.color = '#3b82f6'
    components.push(icon)
    
    const label = createTextComponent(80, startY + index * lineHeight - 3, contact.label + ':')
    label.fontSize = 13
    label.color = '#6b7280'
    label.fontWeight = 'bold'
    label.width = 50
    components.push(label)
    
    const text = createTextComponent(135, startY + index * lineHeight - 3, contact.text)
    text.fontSize = 13
    text.color = '#1f2937'
    components.push(text)
  })
  
  return components
}

// 样式3: 卡片式
export const createContactInfo3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const startY = 150
  const cardWidth = 180
  const cardHeight = 60
  const gap = 15
  
  const contacts = [
    { icon: 'phone', text: '138-0000-0000' },
    { icon: 'email', text: 'example@email.com' },
  ]
  
  contacts.forEach((contact, index) => {
    const col = index % 2
    const row = Math.floor(index / 2)
    const x = 50 + col * (cardWidth + gap)
    const y = startY + row * (cardHeight + gap)
    
    const card = createShapeComponent(x, y, ShapeType.RECTANGLE)
    card.width = cardWidth
    card.height = cardHeight
    card.fill = '#f9fafb'
    card.stroke = '#e5e7eb'
    card.strokeWidth = 1
    card.borderRadius = 8
    components.push(card)
    
    const icon = createIconComponent(x + 15, y + 20, contact.icon)
    icon.width = 20
    icon.height = 20
    icon.color = '#3b82f6'
    components.push(icon)
    
    const text = createTextComponent(x + 45, y + 17, contact.text)
    text.fontSize = 12
    text.color = '#1f2937'
    components.push(text)
  })
  
  return components
}

// ==================== 技能标签模板 ====================

// 样式1: 现代扁平
export const createSkillTags1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const skills = ['React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Docker']
  const startX = 50
  const startY = 350
  const tagWidth = 110
  const tagHeight = 32
  const gapX = 15
  const gapY = 12
  
  skills.forEach((skill, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    
    const tag = createShapeComponent(
      startX + col * (tagWidth + gapX),
      startY + row * (tagHeight + gapY),
      ShapeType.RECTANGLE,
      skill
    )
    tag.width = tagWidth
    tag.height = tagHeight
    tag.borderRadius = 6
    tag.fill = '#eff6ff'
    tag.stroke = '#3b82f6'
    tag.strokeWidth = 1
    tag.text = skill
    tag.fontSize = 13
    tag.textColor = '#1e40af'
    tag.fontWeight = 'normal'
    components.push(tag)
  })
  
  return components
}

// 样式2: 圆角胶囊
export const createSkillTags2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const skills = ['React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Docker']
  const startX = 50
  const startY = 350
  const tagHeight = 28
  const gapX = 10
  const gapY = 10
  
  let currentX = startX
  let currentY = startY
  const maxWidth = 694
  
  skills.forEach((skill) => {
    const tagWidth = skill.length * 12 + 30
    
    if (currentX + tagWidth > startX + maxWidth) {
      currentX = startX
      currentY += tagHeight + gapY
    }
    
    const tag = createShapeComponent(currentX, currentY, ShapeType.RECTANGLE, skill)
    tag.width = tagWidth
    tag.height = tagHeight
    tag.borderRadius = 14
    tag.fill = '#3b82f6'
    tag.stroke = 'transparent'
    tag.text = skill
    tag.fontSize = 12
    tag.textColor = '#ffffff'
    tag.fontWeight = 'normal'
    components.push(tag)
    
    currentX += tagWidth + gapX
  })
  
  return components
}

// 样式3: 带进度条
export const createSkillTags3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const skills = [
    { name: 'React', level: 90 },
    { name: 'Vue', level: 85 },
    { name: 'TypeScript', level: 80 },
    { name: 'Node.js', level: 75 },
  ]
  const startX = 50
  const startY = 350
  const barWidth = 200
  const barHeight = 8
  const lineHeight = 40
  
  skills.forEach((skill, index) => {
    const y = startY + index * lineHeight
    
    const label = createTextComponent(startX, y, skill.name)
    label.fontSize = 14
    label.color = '#1f2937'
    label.fontWeight = 'bold'
    components.push(label)
    
    const bgBar = createShapeComponent(startX, y + 20, ShapeType.RECTANGLE)
    bgBar.width = barWidth
    bgBar.height = barHeight
    bgBar.fill = '#e5e7eb'
    bgBar.stroke = 'transparent'
    bgBar.borderRadius = 4
    components.push(bgBar)
    
    const progressBar = createShapeComponent(startX, y + 20, ShapeType.RECTANGLE)
    progressBar.width = barWidth * (skill.level / 100)
    progressBar.height = barHeight
    progressBar.fill = '#3b82f6'
    progressBar.stroke = 'transparent'
    progressBar.borderRadius = 4
    components.push(progressBar)
    
    const percent = createTextComponent(startX + barWidth + 10, y + 15, `${skill.level}%`)
    percent.fontSize = 11
    percent.color = '#6b7280'
    components.push(percent)
  })
  
  return components
}

// ==================== 工作经历模板 ====================

// 样式1: 卡片式
export const createWorkExperience1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 500
  
  const company = createTextComponent(x + 20, y + 20, '某某科技有限公司')
  company.fontSize = 18
  company.fontWeight = 'bold'
  company.color = '#1f2937'
  components.push(company)
  
  const position = createTextComponent(x + 20, y + 50, '前端工程师')
  position.fontSize = 14
  position.color = '#3b82f6'
  position.fontWeight = 'bold'
  components.push(position)
  
  const time = createTextComponent(x + 550, y + 50, '2020.01 - 2023.12')
  time.fontSize = 13
  time.color = '#6b7280'
  components.push(time)
  
  // 分割线
  const divider = createLineComponent(x + 20, y + 80, true)
  divider.width = 654
  divider.points = [0, 0, 654, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const desc = createTextComponent(x + 20, y + 95, '• 负责公司核心产品的前端开发\n• 参与技术选型和架构设计')
  desc.fontSize = 13
  desc.color = '#4b5563'
  desc.width = 654
  desc.lineHeight = 1.8
  components.push(desc)
  
  return components
}

// 样式2: 时间轴
export const createWorkExperience2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 80
  const y = 500
  
  const timeline = createLineComponent(x, y, false)
  timeline.height = 120
  timeline.points = [0, 0, 0, 120]
  timeline.stroke = '#3b82f6'
  timeline.strokeWidth = 3
  components.push(timeline)
  
  const dot = createShapeComponent(x - 6, y - 6, ShapeType.CIRCLE)
  dot.width = 12
  dot.height = 12
  dot.fill = '#3b82f6'
  dot.stroke = '#ffffff'
  dot.strokeWidth = 2
  components.push(dot)
  
  const company = createTextComponent(x + 20, y - 5, '某某科技有限公司')
  company.fontSize = 16
  company.fontWeight = 'bold'
  company.color = '#1f2937'
  components.push(company)
  
  const position = createTextComponent(x + 20, y + 25, '前端工程师 | 2020.01 - 2023.12')
  position.fontSize = 13
  position.color = '#6b7280'
  components.push(position)
  
  // 分割线
  const divider = createLineComponent(x + 20, y + 50, true)
  divider.width = 580
  divider.points = [0, 0, 580, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const desc = createTextComponent(x + 20, y + 65, '• 负责公司核心产品的前端开发\n• 参与技术选型和架构设计')
  desc.fontSize = 12
  desc.color = '#4b5563'
  desc.width = 580
  desc.lineHeight = 1.8
  components.push(desc)
  
  return components
}

// 样式3: 简洁列表
export const createWorkExperience3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 500
  
  const header = createShapeComponent(x, y, ShapeType.RECTANGLE)
  header.width = 694
  header.height = 40
  header.fill = '#f3f4f6'
  header.stroke = 'transparent'
  header.borderRadius = 6
  components.push(header)
  
  const company = createTextComponent(x + 15, y + 10, '某某科技有限公司')
  company.fontSize = 16
  company.fontWeight = 'bold'
  company.color = '#1f2937'
  components.push(company)
  
  const time = createTextComponent(x + 550, y + 10, '2020.01 - 2023.12')
  time.fontSize = 13
  time.color = '#6b7280'
  components.push(time)
  
  const position = createTextComponent(x, y + 55, '前端工程师')
  position.fontSize = 14
  position.color = '#3b82f6'
  position.fontWeight = 'bold'
  components.push(position)
  
  // 分割线
  const divider = createLineComponent(x, y + 80, true)
  divider.width = 694
  divider.points = [0, 0, 694, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const desc = createTextComponent(x, y + 95, '• 负责公司核心产品的前端开发\n• 参与技术选型和架构设计')
  desc.fontSize = 12
  desc.color = '#4b5563'
  desc.width = 694
  desc.lineHeight = 1.8
  components.push(desc)
  
  return components
}

// ==================== 双栏布局模板 ====================

// 样式1: 左侧深色
export const createTwoColumnLayout1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const leftBg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  leftBg.width = 280
  leftBg.height = 1123
  leftBg.fill = '#1f2937'
  leftBg.stroke = 'transparent'
  components.push(leftBg)
  
  return components
}

// 样式2: 左侧浅色
export const createTwoColumnLayout2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const leftBg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  leftBg.width = 280
  leftBg.height = 1123
  leftBg.fill = '#f3f4f6'
  leftBg.stroke = 'transparent'
  components.push(leftBg)
  
  return components
}

// 样式3: 右侧深色
export const createTwoColumnLayout3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const rightBg = createShapeComponent(514, 0, ShapeType.RECTANGLE)
  rightBg.width = 280
  rightBg.height = 1123
  rightBg.fill = '#1f2937'
  rightBg.stroke = 'transparent'
  components.push(rightBg)
  
  return components
}

// ==================== 教育背景模板 ====================

// 样式1: 带图标
export const createEducation1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 700
  
  const icon = createShapeComponent(x, y, ShapeType.CIRCLE)
  icon.width = 50
  icon.height = 50
  icon.fill = '#3b82f6'
  icon.text = '🎓'
  icon.fontSize = 24
  components.push(icon)
  
  const school = createTextComponent(x + 70, y + 5, '某某大学')
  school.fontSize = 16
  school.fontWeight = 'bold'
  school.color = '#1f2937'
  components.push(school)
  
  // 分割线
  const divider = createLineComponent(x + 70, y + 35, true)
  divider.width = 614
  divider.points = [0, 0, 614, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const major = createTextComponent(x + 70, y + 45, '计算机科学与技术 | 本科 | 2016-2020')
  major.fontSize = 13
  major.color = '#6b7280'
  components.push(major)
  
  return components
}

// 样式2: 卡片式
export const createEducation2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 700
  
  const school = createTextComponent(x + 20, y + 20, '某某大学')
  school.fontSize = 18
  school.fontWeight = 'bold'
  school.color = '#1f2937'
  components.push(school)
  
  // 分割线
  const divider = createLineComponent(x + 20, y + 55, true)
  divider.width = 654
  divider.points = [0, 0, 654, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const major = createTextComponent(x + 20, y + 70, '计算机科学与技术')
  major.fontSize = 14
  major.color = '#3b82f6'
  components.push(major)
  
  const time = createTextComponent(x + 550, y + 70, '2016.09 - 2020.06')
  time.fontSize = 13
  time.color = '#6b7280'
  components.push(time)
  
  return components
}

// 样式3: 简洁列表
export const createEducation3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 700
  
  const school = createTextComponent(x, y, '某某大学')
  school.fontSize = 16
  school.fontWeight = 'bold'
  school.color = '#1f2937'
  components.push(school)
  
  const time = createTextComponent(x + 550, y, '2016 - 2020')
  time.fontSize = 13
  time.color = '#6b7280'
  components.push(time)
  
  // 分割线
  const divider = createLineComponent(x, y + 30, true)
  divider.width = 694
  divider.points = [0, 0, 694, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const major = createTextComponent(x, y + 45, '计算机科学与技术 · 本科 · GPA 3.8/4.0')
  major.fontSize = 13
  major.color = '#4b5563'
  components.push(major)
  
  return components
}

// ==================== 项目经验模板 ====================

// 样式1: 带标题背景
export const createProject1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 800
  
  const titleBg = createShapeComponent(x, y, ShapeType.RECTANGLE)
  titleBg.width = 694
  titleBg.height = 40
  titleBg.fill = '#3b82f6'
  titleBg.borderRadius = 8
  titleBg.text = '企业级管理系统'
  titleBg.fontSize = 16
  titleBg.fontWeight = 'bold'
  titleBg.textColor = '#ffffff'
  components.push(titleBg)
  
  const desc = createTextComponent(x, y + 50, '项目描述：基于React的企业级管理系统，包含用户管理、权限控制等功能')
  desc.fontSize = 13
  desc.color = '#4b5563'
  desc.width = 694
  components.push(desc)
  
  // 分割线
  const divider = createLineComponent(x, y + 80, true)
  divider.width = 694
  divider.points = [0, 0, 694, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const tech = createTextComponent(x, y + 90, '技术栈：React, TypeScript, Ant Design, Redux')
  tech.fontSize = 12
  tech.color = '#6b7280'
  tech.width = 694
  components.push(tech)
  
  const link = createTextComponent(x, y + 115, '🔗 github.com/username/project')
  link.fontSize = 12
  link.color = '#3b82f6'
  link.width = 694
  components.push(link)
  
  return components
}

// 样式2: 卡片式
export const createProject2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 800
  
  const title = createTextComponent(x + 20, y + 20, '企业级管理系统')
  title.fontSize = 16
  title.fontWeight = 'bold'
  title.color = '#1f2937'
  components.push(title)
  
  const role = createTextComponent(x + 20, y + 50, '角色：前端负责人')
  role.fontSize = 13
  role.color = '#3b82f6'
  components.push(role)
  
  const time = createTextComponent(x + 550, y + 50, '2022.01 - 2023.06')
  time.fontSize = 13
  time.color = '#6b7280'
  components.push(time)
  
  // 分割线
  const divider = createLineComponent(x + 20, y + 80, true)
  divider.width = 654
  divider.points = [0, 0, 654, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const desc = createTextComponent(x + 20, y + 95, '• 负责前端架构设计和核心功能开发\n• 优化性能，首屏加载时间减少40%')
  desc.fontSize = 12
  desc.color = '#4b5563'
  desc.width = 654
  desc.lineHeight = 1.8
  components.push(desc)
  
  return components
}

// 样式3: 时间轴
export const createProject3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 80
  const y = 800
  
  const timeline = createLineComponent(x, y, false)
  timeline.height = 120
  timeline.points = [0, 0, 0, 120]
  timeline.stroke = '#10b981'
  timeline.strokeWidth = 3
  components.push(timeline)
  
  const dot = createShapeComponent(x - 6, y - 6, ShapeType.CIRCLE)
  dot.width = 12
  dot.height = 12
  dot.fill = '#10b981'
  dot.stroke = '#ffffff'
  dot.strokeWidth = 2
  components.push(dot)
  
  const title = createTextComponent(x + 20, y - 5, '企业级管理系统')
  title.fontSize = 16
  title.fontWeight = 'bold'
  title.color = '#1f2937'
  components.push(title)
  
  const tech = createTextComponent(x + 20, y + 25, 'React · TypeScript · Ant Design')
  tech.fontSize = 12
  tech.color = '#6b7280'
  components.push(tech)
  
  // 分割线
  const divider = createLineComponent(x + 20, y + 50, true)
  divider.width = 580
  divider.points = [0, 0, 580, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const desc = createTextComponent(x + 20, y + 65, '负责前端架构设计，实现用户管理、权限控制等核心功能')
  desc.fontSize = 12
  desc.color = '#4b5563'
  desc.width = 580
  desc.lineHeight = 1.8
  components.push(desc)
  
  const link = createTextComponent(x + 20, y + 105, '🔗 项目链接: github.com/username/project')
  link.fontSize = 11
  link.color = '#3b82f6'
  components.push(link)
  
  return components
}

// ==================== 个人总结模板 ====================

export const createSummary1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 200
  
  const title = createTextComponent(x, y, '个人简介')
  title.fontSize = 18
  title.fontWeight = 'bold'
  title.color = '#1f2937'
  components.push(title)
  
  const line = createLineComponent(x, y + 30, true)
  line.width = 694
  line.points = [0, 0, 694, 0]
  line.stroke = '#e5e7eb'
  line.strokeWidth = 1
  components.push(line)
  
  const content = createTextComponent(x, y + 45, '5年前端开发经验，精通React/Vue等主流框架，熟悉前端工程化和性能优化。\n具有良好的代码规范和团队协作能力，能够独立完成项目的技术选型和架构设计。')
  content.fontSize = 13
  content.color = '#4b5563'
  content.width = 694
  content.lineHeight = 1.8
  components.push(content)
  
  return components
}

export const createSummary2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 200
  
  const bg = createShapeComponent(x, y, ShapeType.RECTANGLE)
  bg.width = 694
  bg.height = 100
  bg.fill = '#eff6ff'
  bg.stroke = '#3b82f6'
  bg.strokeWidth = 1
  bg.borderRadius = 8
  components.push(bg)
  
  const content = createTextComponent(x + 20, y + 20, '💡 5年前端开发经验，精通React/Vue等主流框架\n🚀 熟悉前端工程化和性能优化\n👥 具有良好的团队协作能力')
  content.fontSize = 13
  content.color = '#1e40af'
  content.width = 654
  content.lineHeight = 1.8
  components.push(content)
  
  return components
}

// ==================== 荣誉奖项模板 ====================

export const createAwards1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 900
  const lineHeight = 35
  
  const awards = [
    { icon: '🏆', text: '2023年度优秀员工', time: '2023.12' },
    { icon: '🥇', text: '技术创新奖', time: '2022.06' },
  ]
  
  awards.forEach((award, index) => {
    const icon = createTextComponent(x, y + index * lineHeight, award.icon)
    icon.fontSize = 20
    components.push(icon)
    
    const text = createTextComponent(x + 35, y + index * lineHeight, award.text)
    text.fontSize = 14
    text.color = '#1f2937'
    components.push(text)
    
    const time = createTextComponent(x + 550, y + index * lineHeight, award.time)
    time.fontSize = 12
    time.color = '#6b7280'
    components.push(time)
  })
  
  return components
}

// ==================== 语言能力模板 ====================

export const createLanguages1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 950
  const lineHeight = 40
  
  const languages = [
    { name: '英语', level: 'CET-6', desc: '熟练阅读英文技术文档' },
    { name: '日语', level: 'N2', desc: '日常交流无障碍' },
  ]
  
  languages.forEach((lang, index) => {
    const name = createTextComponent(x, y + index * lineHeight, lang.name)
    name.fontSize = 14
    name.fontWeight = 'bold'
    name.color = '#1f2937'
    components.push(name)
    
    const level = createTextComponent(x + 80, y + index * lineHeight, lang.level)
    level.fontSize = 13
    level.color = '#3b82f6'
    components.push(level)
    
    const desc = createTextComponent(x + 150, y + index * lineHeight, lang.desc)
    desc.fontSize = 12
    desc.color = '#6b7280'
    components.push(desc)
  })
  
  return components
}

// 所有模板
export const TEMPLATES = {
  // 简历头部
  resumeHeader1: { name: '简历头部 - 居中', create: createResumeHeader1 },
  resumeHeader2: { name: '简历头部 - 左对齐', create: createResumeHeader2 },
  resumeHeader3: { name: '简历头部 - 带背景', create: createResumeHeader3 },
  
  // 联系信息
  contactInfo1: { name: '联系信息 - 横向', create: createContactInfo1 },
  contactInfo2: { name: '联系信息 - 纵向', create: createContactInfo2 },
  contactInfo3: { name: '联系信息 - 卡片', create: createContactInfo3 },
  
  // 个人简介
  summary1: { name: '个人简介 - 标准', create: createSummary1 },
  summary2: { name: '个人简介 - 高亮', create: createSummary2 },
  
  // 技能标签
  skillTags1: { name: '技能标签 - 扁平', create: createSkillTags1 },
  skillTags2: { name: '技能标签 - 胶囊', create: createSkillTags2 },
  skillTags3: { name: '技能标签 - 进度条', create: createSkillTags3 },
  
  // 工作经历
  workExperience1: { name: '工作经历 - 卡片', create: createWorkExperience1 },
  workExperience2: { name: '工作经历 - 时间轴', create: createWorkExperience2 },
  workExperience3: { name: '工作经历 - 列表', create: createWorkExperience3 },
  
  // 教育背景
  education1: { name: '教育背景 - 图标', create: createEducation1 },
  education2: { name: '教育背景 - 卡片', create: createEducation2 },
  education3: { name: '教育背景 - 列表', create: createEducation3 },
  
  // 项目经验
  project1: { name: '项目经验 - 标题背景', create: createProject1 },
  project2: { name: '项目经验 - 卡片', create: createProject2 },
  project3: { name: '项目经验 - 时间轴', create: createProject3 },
  
  // 荣誉奖项
  awards1: { name: '荣誉奖项', create: createAwards1 },
  
  // 语言能力
  languages1: { name: '语言能力', create: createLanguages1 },
  
  // 双栏布局
  twoColumnLayout1: { name: '双栏 - 左深色', create: createTwoColumnLayout1 },
  twoColumnLayout2: { name: '双栏 - 左浅色', create: createTwoColumnLayout2 },
  twoColumnLayout3: { name: '双栏 - 右深色', create: createTwoColumnLayout3 },
  
  // 整体边框
  pageBorder1: { name: '页面边框 - 简洁', create: createPageBorder1 },
  pageBorder2: { name: '页面边框 - 双线', create: createPageBorder2 },
  pageBorder3: { name: '页面边框 - 装饰', create: createPageBorder3 },
  
  // 页眉
  header1: { name: '页眉 - 简洁', create: createHeader1 },
  header2: { name: '页眉 - 带装饰', create: createHeader2 },
  header3: { name: '页眉 - 极简', create: createHeader3 },
  
  // 页脚
  footer1: { name: '页脚 - 简洁', create: createFooter1 },
  footer2: { name: '页脚 - 带联系方式', create: createFooter2 },
  footer3: { name: '页脚 - 极简', create: createFooter3 },
}


// ==================== 整体边框模板 ====================

// 样式1: 简洁边框
export const createPageBorder1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const border = createShapeComponent(20, 20, ShapeType.RECTANGLE)
  border.width = 754
  border.height = 1083
  border.fill = 'transparent'
  border.stroke = '#d1d5db'
  border.strokeWidth = 2
  border.borderRadius = 0
  components.push(border)
  
  return components
}

// 样式2: 双线边框
export const createPageBorder2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  // 外边框
  const outerBorder = createShapeComponent(15, 15, ShapeType.RECTANGLE)
  outerBorder.width = 764
  outerBorder.height = 1093
  outerBorder.fill = 'transparent'
  outerBorder.stroke = '#6b7280'
  outerBorder.strokeWidth = 1
  outerBorder.borderRadius = 0
  components.push(outerBorder)
  
  // 内边框
  const innerBorder = createShapeComponent(25, 25, ShapeType.RECTANGLE)
  innerBorder.width = 744
  innerBorder.height = 1073
  innerBorder.fill = 'transparent'
  innerBorder.stroke = '#6b7280'
  innerBorder.strokeWidth = 1
  innerBorder.borderRadius = 0
  components.push(innerBorder)
  
  return components
}

// 样式3: 装饰性边框
export const createPageBorder3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const border = createShapeComponent(20, 20, ShapeType.RECTANGLE)
  border.width = 754
  border.height = 1083
  border.fill = 'transparent'
  border.stroke = '#3b82f6'
  border.strokeWidth = 3
  border.borderRadius = 8
  components.push(border)
  
  // 四角装饰
  const cornerSize = 20
  const corners = [
    { x: 20, y: 20 }, // 左上
    { x: 754, y: 20 }, // 右上
    { x: 20, y: 1083 }, // 左下
    { x: 754, y: 1083 }, // 右下
  ]
  
  corners.forEach((pos) => {
    const corner = createShapeComponent(pos.x, pos.y, ShapeType.RECTANGLE)
    corner.width = cornerSize
    corner.height = cornerSize
    corner.fill = '#3b82f6'
    corner.stroke = 'transparent'
    corner.borderRadius = 0
    components.push(corner)
  })
  
  return components
}

// ==================== 页眉模板 ====================

// 样式1: 简洁页眉
export const createHeader1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const bg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  bg.width = 794
  bg.height = 60
  bg.fill = '#f3f4f6'
  bg.stroke = 'transparent'
  components.push(bg)
  
  const title = createTextComponent(50, 20, '个人简历')
  title.fontSize = 16
  title.fontWeight = 'bold'
  title.color = '#1f2937'
  components.push(title)
  
  const divider = createLineComponent(0, 60, true)
  divider.width = 794
  divider.points = [0, 0, 794, 0]
  divider.stroke = '#d1d5db'
  divider.strokeWidth = 1
  components.push(divider)
  
  return components
}

// 样式2: 带装饰页眉
export const createHeader2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const bg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  bg.width = 794
  bg.height = 80
  bg.fill = '#1f2937'
  bg.stroke = 'transparent'
  components.push(bg)
  
  const title = createTextComponent(50, 25, '个人简历')
  title.fontSize = 20
  title.fontWeight = 'bold'
  title.color = '#ffffff'
  components.push(title)
  
  const subtitle = createTextComponent(50, 50, 'Professional Resume')
  subtitle.fontSize = 12
  subtitle.color = '#d1d5db'
  components.push(subtitle)
  
  return components
}

// 样式3: 极简页眉
export const createHeader3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  const title = createTextComponent(50, 20, '简历')
  title.fontSize = 14
  title.color = '#6b7280'
  components.push(title)
  
  const divider = createLineComponent(50, 45, true)
  divider.width = 694
  divider.points = [0, 0, 694, 0]
  divider.stroke = '#3b82f6'
  divider.strokeWidth = 2
  components.push(divider)
  
  return components
}

// ==================== 页脚模板 ====================

// 样式1: 简洁页脚
export const createFooter1 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const y = 1063
  
  const divider = createLineComponent(0, y, true)
  divider.width = 794
  divider.points = [0, 0, 794, 0]
  divider.stroke = '#d1d5db'
  divider.strokeWidth = 1
  components.push(divider)
  
  const bg = createShapeComponent(0, y, ShapeType.RECTANGLE)
  bg.width = 794
  bg.height = 60
  bg.fill = '#f3f4f6'
  bg.stroke = 'transparent'
  components.push(bg)
  
  const pageNum = createTextComponent(370, y + 20, '第 1 页')
  pageNum.fontSize = 12
  pageNum.color = '#6b7280'
  components.push(pageNum)
  
  return components
}

// 样式2: 带联系方式页脚
export const createFooter2 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const y = 1063
  
  const divider = createLineComponent(0, y, true)
  divider.width = 794
  divider.points = [0, 0, 794, 0]
  divider.stroke = '#d1d5db'
  divider.strokeWidth = 1
  components.push(divider)
  
  const bg = createShapeComponent(0, y, ShapeType.RECTANGLE)
  bg.width = 794
  bg.height = 60
  bg.fill = '#ffffff'
  bg.stroke = 'transparent'
  components.push(bg)
  
  const contact = createTextComponent(50, y + 20, '📧 email@example.com  |  📱 138-0000-0000  |  🔗 github.com/username')
  contact.fontSize = 11
  contact.color = '#6b7280'
  components.push(contact)
  
  return components
}

// 样式3: 极简页脚
export const createFooter3 = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const y = 1090
  
  const divider = createLineComponent(50, y, true)
  divider.width = 694
  divider.points = [0, 0, 694, 0]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 1
  components.push(divider)
  
  const text = createTextComponent(350, y + 15, '- 1 -')
  text.fontSize = 10
  text.color = '#9ca3af'
  components.push(text)
  
  return components
}
