// 完整简历模板 - 多页面版本
import { CanvasComponent } from '@/types/canvas'
import {
  createResumeHeader1,
  createResumeHeader2,
  createResumeHeader3,
  createContactInfo1,
  createContactInfo2,
  createContactInfo3,
  createSummary1,
  createSummary2,
  createSkillTags2,
  createSkillTags3,
  createSkillTags4,
  createSkillTags5,
  createWorkExperience1,
  createWorkExperience2,
  createWorkExperience3,
  createProject1,
  createProject2,
  createProject3,
  createEducation1,
  createEducation2,
  createEducation3,
  createAwards1,
  createLanguages1,
  createHeader2,
  createFooter2,
} from './templates'
import { createTextComponent, createLineComponent } from './componentFactory'

// 辅助函数：调整组件位置的偏移量
const offsetComponents = (components: CanvasComponent[], offsetY: number): CanvasComponent[] => {
  return components.map(comp => {
    const newComp = { ...comp }
    newComp.y += offsetY
    return newComp
  })
}

// 辅助函数：创建分割线
const createDivider = (y: number, width: number = 694): CanvasComponent => {
  const divider = createLineComponent(50, y, true)
  divider.width = width
  divider.stroke = '#d1d5db'
  divider.strokeWidth = 1
  return divider
}

// 辅助函数：创建章节标题
const createSectionTitle = (y: number, title: string): CanvasComponent => {
  const titleComp = createTextComponent(50, y, title)
  titleComp.fontSize = 18
  titleComp.fontWeight = 'bold'
  titleComp.color = '#1f2937'
  return titleComp
}

// 多页面模板返回类型
export type MultiPageTemplate = Array<{ components: CanvasComponent[] }>

// 现代风格完整简历 - 互联网/科技行业（2页）
export const createModernFullResume = (): MultiPageTemplate => {
  const page1Components: CanvasComponent[] = []
  const page2Components: CanvasComponent[] = []
  
  // ========== 第1页 ==========
  let currentY = 40
  
  // 1. 简历头部 - 居中
  const header = createResumeHeader1()
  page1Components.push(...offsetComponents(header, currentY - header[0].y))
  currentY += 90
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 25
  
  // 2. 联系信息 - 横向图标
  const contact = createContactInfo1()
  page1Components.push(...offsetComponents(contact, currentY - contact[0].y))
  currentY += 50
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 3. 个人简介
  page1Components.push(createSectionTitle(currentY, '个人简介'))
  currentY += 30
  const summary = createSummary2()
  page1Components.push(...offsetComponents(summary, currentY - summary[0].y))
  currentY += 100
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 4. 专业技能
  page1Components.push(createSectionTitle(currentY, '专业技能'))
  currentY += 30
  const skills = createSkillTags2()
  page1Components.push(...offsetComponents(skills, currentY - skills[0].y))
  currentY += 80
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 5. 工作经历（第1段）
  page1Components.push(createSectionTitle(currentY, '工作经历'))
  currentY += 35
  const work1 = createWorkExperience2()
  page1Components.push(...offsetComponents(work1, currentY - work1[0].y))
  currentY += 180
  
  // 第2段工作经历
  const work2 = createWorkExperience2()
  page1Components.push(...offsetComponents(work2, currentY - work2[0].y))
  currentY += 180
  
  // 第3段工作经历
  const work3 = createWorkExperience2()
  page1Components.push(...offsetComponents(work3, currentY - work3[0].y))
  
  // ========== 第2页 ==========
  currentY = 40
  
  // 6. 项目经验
  page2Components.push(createSectionTitle(currentY, '项目经验'))
  currentY += 35
  const project1 = createProject2()
  page2Components.push(...offsetComponents(project1, currentY - project1[0].y))
  currentY += 160
  
  // 第2个项目
  const project2 = createProject2()
  page2Components.push(...offsetComponents(project2, currentY - project2[0].y))
  currentY += 160
  
  // 第3个项目
  const project3 = createProject2()
  page2Components.push(...offsetComponents(project3, currentY - project3[0].y))
  currentY += 160
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 7. 教育背景
  page2Components.push(createSectionTitle(currentY, '教育背景'))
  currentY += 35
  const education = createEducation2()
  page2Components.push(...offsetComponents(education, currentY - education[0].y))
  currentY += 120
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 8. 荣誉奖项
  page2Components.push(createSectionTitle(currentY, '荣誉奖项'))
  currentY += 30
  const awards = createAwards1()
  page2Components.push(...offsetComponents(awards, currentY - awards[0].y))
  
  return [
    { components: page1Components },
    { components: page2Components }
  ]
}

// 经典风格完整简历 - 传统行业/正式场合（2页）
export const createClassicFullResume = (): MultiPageTemplate => {
  const page1Components: CanvasComponent[] = []
  const page2Components: CanvasComponent[] = []
  
  // ========== 第1页 ==========
  let currentY = 40
  
  // 1. 简历头部 - 左对齐
  const header = createResumeHeader2()
  page1Components.push(...offsetComponents(header, currentY - header[0].y))
  currentY += 90
  
  // 粗分割线
  const divider1 = createDivider(currentY)
  divider1.strokeWidth = 2
  divider1.stroke = '#374151'
  page1Components.push(divider1)
  currentY += 25
  
  // 2. 联系信息 - 纵向列表
  const contact = createContactInfo2()
  page1Components.push(...offsetComponents(contact, currentY - contact[0].y))
  currentY += 90
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 3. 个人简介
  page1Components.push(createSectionTitle(currentY, '个人简介'))
  currentY += 30
  const summary = createSummary1()
  page1Components.push(...offsetComponents(summary, currentY - summary[0].y))
  currentY += 90
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 4. 专业技能
  page1Components.push(createSectionTitle(currentY, '专业技能'))
  currentY += 30
  const skills = createSkillTags4()
  page1Components.push(...offsetComponents(skills, currentY - skills[0].y))
  currentY += 50
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 5. 工作经历
  page1Components.push(createSectionTitle(currentY, '工作经历'))
  currentY += 35
  const work1 = createWorkExperience3()
  page1Components.push(...offsetComponents(work1, currentY - work1[0].y))
  currentY += 160
  
  // 第2段工作经历
  const work2 = createWorkExperience3()
  page1Components.push(...offsetComponents(work2, currentY - work2[0].y))
  currentY += 160
  
  // 第3段工作经历
  const work3 = createWorkExperience3()
  page1Components.push(...offsetComponents(work3, currentY - work3[0].y))
  
  // ========== 第2页 ==========
  currentY = 40
  
  // 6. 项目经验
  page2Components.push(createSectionTitle(currentY, '项目经验'))
  currentY += 35
  const project1 = createProject1()
  page2Components.push(...offsetComponents(project1, currentY - project1[0].y))
  currentY += 140
  
  // 第2个项目
  const project2 = createProject1()
  page2Components.push(...offsetComponents(project2, currentY - project2[0].y))
  currentY += 140
  
  // 第3个项目
  const project3 = createProject1()
  page2Components.push(...offsetComponents(project3, currentY - project3[0].y))
  currentY += 140
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 7. 教育背景
  page2Components.push(createSectionTitle(currentY, '教育背景'))
  currentY += 35
  const education = createEducation3()
  page2Components.push(...offsetComponents(education, currentY - education[0].y))
  currentY += 100
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 8. 语言能力
  page2Components.push(createSectionTitle(currentY, '语言能力'))
  currentY += 30
  const languages = createLanguages1()
  page2Components.push(...offsetComponents(languages, currentY - languages[0].y))
  currentY += 80
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 9. 荣誉奖项
  page2Components.push(createSectionTitle(currentY, '荣誉奖项'))
  currentY += 30
  const awards = createAwards1()
  page2Components.push(...offsetComponents(awards, currentY - awards[0].y))
  
  return [
    { components: page1Components },
    { components: page2Components }
  ]
}

// 简约风格完整简历 - 设计/创意行业（2页）
export const createMinimalFullResume = (): MultiPageTemplate => {
  const page1Components: CanvasComponent[] = []
  const page2Components: CanvasComponent[] = []
  
  // ========== 第1页 ==========
  let currentY = 50
  
  // 1. 简历头部 - 居中
  const header = createResumeHeader1()
  page1Components.push(...offsetComponents(header, currentY - header[0].y))
  currentY += 90
  
  // 细分割线
  const divider1 = createDivider(currentY)
  divider1.strokeWidth = 0.5
  divider1.stroke = '#9ca3af'
  page1Components.push(divider1)
  currentY += 20
  
  // 2. 联系信息 - 横向
  const contact = createContactInfo1()
  page1Components.push(...offsetComponents(contact, currentY - contact[0].y))
  currentY += 50
  
  // 细分割线
  const divider2 = createDivider(currentY)
  divider2.strokeWidth = 0.5
  divider2.stroke = '#9ca3af'
  page1Components.push(divider2)
  currentY += 35
  
  // 3. 个人简介
  page1Components.push(createSectionTitle(currentY, '关于我'))
  currentY += 30
  const summary = createSummary1()
  page1Components.push(...offsetComponents(summary, currentY - summary[0].y))
  currentY += 90
  
  // 细分割线
  const divider3 = createDivider(currentY)
  divider3.strokeWidth = 0.5
  divider3.stroke = '#9ca3af'
  page1Components.push(divider3)
  currentY += 35
  
  // 4. 专业技能 - 竖线分隔
  page1Components.push(createSectionTitle(currentY, '技能'))
  currentY += 30
  const skills = createSkillTags5()
  page1Components.push(...offsetComponents(skills, currentY - skills[0].y))
  currentY += 50
  
  // 细分割线
  const divider4 = createDivider(currentY)
  divider4.strokeWidth = 0.5
  divider4.stroke = '#9ca3af'
  page1Components.push(divider4)
  currentY += 35
  
  // 5. 工作经历
  page1Components.push(createSectionTitle(currentY, '经历'))
  currentY += 35
  const work1 = createWorkExperience1()
  page1Components.push(...offsetComponents(work1, currentY - work1[0].y))
  currentY += 150
  
  // 第2段工作经历
  const work2 = createWorkExperience1()
  page1Components.push(...offsetComponents(work2, currentY - work2[0].y))
  currentY += 150
  
  // 第3段工作经历
  const work3 = createWorkExperience1()
  page1Components.push(...offsetComponents(work3, currentY - work3[0].y))
  
  // ========== 第2页 ==========
  currentY = 50
  
  // 6. 项目经验
  page2Components.push(createSectionTitle(currentY, '项目'))
  currentY += 35
  const project1 = createProject3()
  page2Components.push(...offsetComponents(project1, currentY - project1[0].y))
  currentY += 140
  
  // 第2个项目
  const project2 = createProject3()
  page2Components.push(...offsetComponents(project2, currentY - project2[0].y))
  currentY += 140
  
  // 第3个项目
  const project3 = createProject3()
  page2Components.push(...offsetComponents(project3, currentY - project3[0].y))
  currentY += 140
  
  // 细分割线
  const divider5 = createDivider(currentY)
  divider5.strokeWidth = 0.5
  divider5.stroke = '#9ca3af'
  page2Components.push(divider5)
  currentY += 35
  
  // 7. 教育背景
  page2Components.push(createSectionTitle(currentY, '教育'))
  currentY += 35
  const education = createEducation1()
  page2Components.push(...offsetComponents(education, currentY - education[0].y))
  currentY += 100
  
  // 细分割线
  const divider6 = createDivider(currentY)
  divider6.strokeWidth = 0.5
  divider6.stroke = '#9ca3af'
  page2Components.push(divider6)
  currentY += 35
  
  // 8. 荣誉奖项
  page2Components.push(createSectionTitle(currentY, '荣誉'))
  currentY += 30
  const awards = createAwards1()
  page2Components.push(...offsetComponents(awards, currentY - awards[0].y))
  
  return [
    { components: page1Components },
    { components: page2Components }
  ]
}

// 专业风格完整简历 - 高级职位/管理岗位（2页）
export const createProfessionalFullResume = (): MultiPageTemplate => {
  const page1Components: CanvasComponent[] = []
  const page2Components: CanvasComponent[] = []
  
  // ========== 第1页 ==========
  // 页眉
  const headerComp = createHeader2()
  page1Components.push(...headerComp)
  
  let currentY = 70
  
  // 1. 简历头部 - 带背景
  const resumeHeader = createResumeHeader3()
  page1Components.push(...offsetComponents(resumeHeader, currentY - resumeHeader[0].y))
  currentY += 110
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 25
  
  // 2. 联系信息 - 卡片式
  const contact = createContactInfo3()
  page1Components.push(...offsetComponents(contact, currentY - contact[0].y))
  currentY += 70
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 3. 个人简介
  page1Components.push(createSectionTitle(currentY, '职业概述'))
  currentY += 30
  const summary = createSummary2()
  page1Components.push(...offsetComponents(summary, currentY - summary[0].y))
  currentY += 100
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 4. 核心技能 - 进度条
  page1Components.push(createSectionTitle(currentY, '核心技能'))
  currentY += 30
  const skills = createSkillTags3()
  page1Components.push(...offsetComponents(skills, currentY - skills[0].y))
  currentY += 180
  
  // 分割线
  page1Components.push(createDivider(currentY))
  currentY += 30
  
  // 5. 工作经历（第1段）
  page1Components.push(createSectionTitle(currentY, '工作经历'))
  currentY += 35
  const work1 = createWorkExperience2()
  page1Components.push(...offsetComponents(work1, currentY - work1[0].y))
  currentY += 180
  
  // 第2段工作经历
  const work2 = createWorkExperience2()
  page1Components.push(...offsetComponents(work2, currentY - work2[0].y))
  
  // 页脚
  const footer1 = createFooter2()
  page1Components.push(...footer1)
  
  // ========== 第2页 ==========
  // 页眉
  const headerComp2 = createHeader2()
  page2Components.push(...headerComp2)
  
  currentY = 70
  
  // 工作经历（第3段）
  page2Components.push(createSectionTitle(currentY, '工作经历（续）'))
  currentY += 35
  const work3 = createWorkExperience2()
  page2Components.push(...offsetComponents(work3, currentY - work3[0].y))
  currentY += 180
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 6. 重点项目
  page2Components.push(createSectionTitle(currentY, '重点项目'))
  currentY += 35
  const project1 = createProject2()
  page2Components.push(...offsetComponents(project1, currentY - project1[0].y))
  currentY += 160
  
  // 第2个项目
  const project2 = createProject2()
  page2Components.push(...offsetComponents(project2, currentY - project2[0].y))
  currentY += 160
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 7. 教育背景
  page2Components.push(createSectionTitle(currentY, '教育背景'))
  currentY += 35
  const education = createEducation2()
  page2Components.push(...offsetComponents(education, currentY - education[0].y))
  currentY += 120
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 8. 语言能力
  page2Components.push(createSectionTitle(currentY, '语言能力'))
  currentY += 30
  const languages = createLanguages1()
  page2Components.push(...offsetComponents(languages, currentY - languages[0].y))
  currentY += 80
  
  // 分割线
  page2Components.push(createDivider(currentY))
  currentY += 30
  
  // 9. 荣誉认证
  page2Components.push(createSectionTitle(currentY, '荣誉认证'))
  currentY += 30
  const awards = createAwards1()
  page2Components.push(...offsetComponents(awards, currentY - awards[0].y))
  
  // 页脚
  const footer2 = createFooter2()
  page2Components.push(...footer2)
  
  return [
    { components: page1Components },
    { components: page2Components }
  ]
}

// 导出完整模板集合
export const FULL_TEMPLATES_MULTI_PAGE = {
  modern: { name: '现代风格', description: '时尚现代，适合互联网行业', create: createModernFullResume },
  classic: { name: '经典风格', description: '传统稳重，适合传统行业', create: createClassicFullResume },
  minimal: { name: '简约风格', description: '简洁清爽，突出重点', create: createMinimalFullResume },
  professional: { name: '专业风格', description: '正式专业，带页眉页脚', create: createProfessionalFullResume },
}
