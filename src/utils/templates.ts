import { CanvasComponent } from '@/types/canvas'
import {
  createTextComponent,
  createShapeComponent,
  createLineComponent,
  createIconComponent,
} from './componentFactory'
import { ShapeType } from '@/types/canvas'

// 简历头部模板
export const createResumeHeader = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  // 姓名
  const name = createTextComponent(50, 40, '张三')
  name.fontSize = 32
  name.fontWeight = 'bold'
  name.color = '#1f2937'
  components.push(name)
  
  // 职位
  const title = createTextComponent(50, 85, '高级前端工程师')
  title.fontSize = 18
  title.color = '#6b7280'
  components.push(title)
  
  // 分隔线
  const line = createLineComponent(50, 130, true)
  line.width = 694
  line.points = [0, 0, 694, 0]
  line.stroke = '#e5e7eb'
  line.strokeWidth = 2
  components.push(line)
  
  return components
}

// 联系信息模板
export const createContactInfo = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const startY = 150
  const lineHeight = 30
  
  const contacts = [
    { icon: 'phone', text: '电话: 138-0000-0000' },
    { icon: 'email', text: '邮箱: example@email.com' },
    { icon: 'location', text: '地址: 北京市朝阳区' },
    { icon: 'link', text: '网站: www.example.com' },
  ]
  
  contacts.forEach((contact, index) => {
    const icon = createIconComponent(50, startY + index * lineHeight, contact.icon)
    icon.width = 20
    icon.height = 20
    components.push(icon)
    
    const text = createTextComponent(80, startY + index * lineHeight - 5, contact.text)
    text.fontSize = 14
    text.color = '#4b5563'
    components.push(text)
  })
  
  return components
}

// 技能标签模板
export const createSkillTags = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const skills = ['React', 'Vue', 'TypeScript', 'Node.js', 'Python', 'Docker']
  const startX = 50
  const startY = 350
  const tagWidth = 100
  const tagHeight = 35
  const gap = 15
  
  skills.forEach((skill, index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    
    const tag = createShapeComponent(
      startX + col * (tagWidth + gap),
      startY + row * (tagHeight + gap),
      ShapeType.RECTANGLE,
      skill
    )
    tag.width = tagWidth
    tag.height = tagHeight
    tag.borderRadius = 8
    tag.fill = '#dbeafe'
    tag.stroke = '#3b82f6'
    tag.strokeWidth = 1
    tag.text = skill
    tag.fontSize = 14
    tag.textColor = '#1e40af'
    components.push(tag)
  })
  
  return components
}

// 工作经历卡片
export const createWorkExperienceCard = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 500
  
  // 背景卡片
  const card = createShapeComponent(x, y, ShapeType.RECTANGLE)
  card.width = 694
  card.height = 150
  card.fill = '#f9fafb'
  card.stroke = '#e5e7eb'
  card.strokeWidth = 1
  card.borderRadius = 8
  components.push(card)
  
  // 公司名称
  const company = createTextComponent(x + 20, y + 20, '某某科技有限公司')
  company.fontSize = 18
  company.fontWeight = 'bold'
  company.color = '#1f2937'
  components.push(company)
  
  // 职位和时间
  const position = createTextComponent(x + 20, y + 50, '前端工程师')
  position.fontSize = 14
  position.color = '#6b7280'
  components.push(position)
  
  const time = createTextComponent(x + 550, y + 50, '2020.01 - 2023.12')
  time.fontSize = 14
  time.color = '#9ca3af'
  components.push(time)
  
  // 工作描述
  const desc = createTextComponent(x + 20, y + 80, '• 负责公司核心产品的前端开发\n• 参与技术选型和架构设计\n• 优化性能，提升用户体验')
  desc.fontSize = 12
  desc.color = '#4b5563'
  desc.width = 654
  desc.height = 60
  desc.lineHeight = 1.6
  components.push(desc)
  
  return components
}

// 教育背景
export const createEducationCard = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 700
  
  // 学校图标
  const icon = createShapeComponent(x, y, ShapeType.CIRCLE)
  icon.width = 50
  icon.height = 50
  icon.fill = '#3b82f6'
  icon.text = '🎓'
  icon.fontSize = 24
  components.push(icon)
  
  // 学校名称
  const school = createTextComponent(x + 70, y + 5, '某某大学')
  school.fontSize = 16
  school.fontWeight = 'bold'
  school.color = '#1f2937'
  components.push(school)
  
  // 专业和时间
  const major = createTextComponent(x + 70, y + 30, '计算机科学与技术 | 本科 | 2016-2020')
  major.fontSize = 13
  major.color = '#6b7280'
  components.push(major)
  
  return components
}

// 项目经验卡片
export const createProjectCard = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  const y = 800
  
  // 项目标题背景
  const titleBg = createShapeComponent(x, y, ShapeType.RECTANGLE)
  titleBg.width = 694
  titleBg.height = 40
  titleBg.fill = '#3b82f6'
  titleBg.borderRadius = 8
  titleBg.text = '项目名称'
  titleBg.fontSize = 16
  titleBg.fontWeight = 'bold'
  titleBg.textColor = '#ffffff'
  components.push(titleBg)
  
  // 项目描述
  const desc = createTextComponent(x, y + 50, '项目描述：这是一个基于React的企业级管理系统...')
  desc.fontSize = 13
  desc.color = '#4b5563'
  desc.width = 694
  components.push(desc)
  
  // 技术栈
  const tech = createTextComponent(x, y + 80, '技术栈：React, TypeScript, Ant Design, Redux')
  tech.fontSize = 12
  tech.color = '#6b7280'
  tech.width = 694
  components.push(tech)
  
  return components
}

// 分栏布局
export const createTwoColumnLayout = (): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  // 左栏背景
  const leftBg = createShapeComponent(0, 0, ShapeType.RECTANGLE)
  leftBg.width = 250
  leftBg.height = 1123
  leftBg.fill = '#1f2937'
  leftBg.stroke = 'transparent'
  components.push(leftBg)
  
  // 右栏分隔线
  const divider = createLineComponent(250, 0, false)
  divider.height = 1123
  divider.points = [0, 0, 0, 1123]
  divider.stroke = '#e5e7eb'
  divider.strokeWidth = 2
  components.push(divider)
  
  return components
}

// 标题组件
export const createSectionTitle = (text: string, y: number): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  
  // 装饰线
  const line = createLineComponent(50, y + 10, true)
  line.width = 30
  line.points = [0, 0, 30, 0]
  line.stroke = '#3b82f6'
  line.strokeWidth = 4
  components.push(line)
  
  // 标题文本
  const title = createTextComponent(90, y, text)
  title.fontSize = 20
  title.fontWeight = 'bold'
  title.color = '#1f2937'
  components.push(title)
  
  // 底部分隔线
  const bottomLine = createLineComponent(50, y + 35, true)
  bottomLine.width = 694
  bottomLine.points = [0, 0, 694, 0]
  bottomLine.stroke = '#e5e7eb'
  bottomLine.strokeWidth = 1
  components.push(bottomLine)
  
  return components
}

// 进度条组件
export const createProgressBar = (label: string, percentage: number, y: number): CanvasComponent[] => {
  const components: CanvasComponent[] = []
  const x = 50
  
  // 标签
  const labelText = createTextComponent(x, y, label)
  labelText.fontSize = 14
  labelText.color = '#4b5563'
  components.push(labelText)
  
  // 背景条
  const bgBar = createShapeComponent(x, y + 25, ShapeType.RECTANGLE)
  bgBar.width = 200
  bgBar.height = 10
  bgBar.fill = '#e5e7eb'
  bgBar.stroke = 'transparent'
  bgBar.borderRadius = 5
  components.push(bgBar)
  
  // 进度条
  const progressBar = createShapeComponent(x, y + 25, ShapeType.RECTANGLE)
  progressBar.width = 200 * (percentage / 100)
  progressBar.height = 10
  progressBar.fill = '#3b82f6'
  progressBar.stroke = 'transparent'
  progressBar.borderRadius = 5
  components.push(progressBar)
  
  // 百分比
  const percentText = createTextComponent(x + 210, y + 20, `${percentage}%`)
  percentText.fontSize = 12
  percentText.color = '#6b7280'
  components.push(percentText)
  
  return components
}

// 所有模板
export const TEMPLATES = {
  resumeHeader: { name: '简历头部', create: createResumeHeader },
  contactInfo: { name: '联系信息', create: createContactInfo },
  skillTags: { name: '技能标签', create: createSkillTags },
  workExperience: { name: '工作经历', create: createWorkExperienceCard },
  education: { name: '教育背景', create: createEducationCard },
  project: { name: '项目经验', create: createProjectCard },
  twoColumn: { name: '双栏布局', create: createTwoColumnLayout },
}
