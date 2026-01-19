import { Type, Image, Square, Minus, Star, Layout, Briefcase, GraduationCap, Code, Phone, Award } from 'lucide-react'
import { useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import {
  createTextComponent,
  createImageComponent,
  createShapeComponent,
  createLineComponent,
  createIconComponent,
} from '@/utils/componentFactory'
import { ShapeType } from '@/types/canvas'
import { TEMPLATES, FULL_TEMPLATES } from '@/utils/templates'

const ComponentLibrary = () => {
  const { addComponent, clearCanvas } = useCanvasStore()
  const [activeTab, setActiveTab] = useState<'templates' | 'full'>('templates')

  const addText = () => {
    addComponent(createTextComponent(100, 100))
  }

  const addTextBlock = () => {
    const textBlock = createTextComponent(100, 100, '这是一个文本块，可以输入多行内容。\n双击编辑文本。\n适合输入段落、描述等较长内容。')
    textBlock.width = 400
    textBlock.height = 120
    textBlock.fontSize = 14
    textBlock.lineHeight = 1.8
    addComponent(textBlock)
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const src = event.target?.result as string
          addComponent(createImageComponent(100, 100, src))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addShape = (shapeType: ShapeType) => {
    addComponent(createShapeComponent(100, 100, shapeType))
  }

  const addLine = (horizontal = true) => {
    addComponent(createLineComponent(100, 100, horizontal))
  }

  const addIcon = () => {
    addComponent(createIconComponent(100, 100))
  }

  const addTemplate = (templateKey: keyof typeof TEMPLATES) => {
    const template = TEMPLATES[templateKey]
    const newComponents = template.create()
    
    // 获取store和当前组件列表
    const store = useCanvasStore.getState()
    const allComponents = store.components || []
    
    // 计算新模板应该放置的Y坐标
    let startY = 50 // 默认起始位置
    
    if (allComponents.length > 0) {
      // 找到所有组件的最大底部位置
      let maxBottom = 0
      allComponents.forEach((comp) => {
        const bottom = comp.y + (comp.height || 0)
        if (bottom > maxBottom) {
          maxBottom = bottom
        }
      })
      // 新模板从最大底部位置 + 间距开始
      startY = maxBottom + 40
    }
    
    // 计算模板的原始起始Y坐标
    const templateMinY = Math.min(...newComponents.map(c => c.y))
    
    // 计算Y轴偏移量
    const offsetY = startY - templateMinY
    
    // 调整所有组件的Y坐标并重新生成ID
    const adjustedComponents = newComponents.map(comp => {
      const newComp = { ...comp }
      newComp.y = comp.y + offsetY
      // 生成唯一ID
      newComp.id = `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      return newComp
    })
    
    // 计算调整后组件的边界框
    const minX = Math.min(...adjustedComponents.map(c => c.x))
    const minY = Math.min(...adjustedComponents.map(c => c.y))
    const maxX = Math.max(...adjustedComponents.map(c => c.x + (c.width || 0)))
    const maxY = Math.max(...adjustedComponents.map(c => c.y + (c.height || 0)))
    
    // 设置padding
    const padding = 20
    
    // 创建隐形背景边框
    const background = createShapeComponent(
      minX - padding,
      minY - padding,
      ShapeType.RECTANGLE
    )
    background.width = (maxX - minX) + (padding * 2)
    background.height = (maxY - minY) + (padding * 2)
    background.fill = '#ffffff'
    background.opacity = 0.01
    background.stroke = 'transparent'
    background.strokeWidth = 0
    background.id = `bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    background.zIndex = -1
    
    // 将背景边框放在最前面
    const componentsWithBg = [background, ...adjustedComponents]
    
    // 添加所有组件到画布
    componentsWithBg.forEach((comp) => addComponent(comp))
    
    // 自动创建组
    if (componentsWithBg.length >= 2) {
      setTimeout(() => {
        const store = useCanvasStore.getState()
        const componentIds = componentsWithBg.map((c) => c.id)
        
        store.clearSelection()
        componentIds.forEach((id) => store.selectComponent(id, true))
        store.createGroup(template.name)
        store.clearSelection()
      }, 50)
    }
  }

  const addFullTemplate = (templateKey: keyof typeof FULL_TEMPLATES) => {
    // 清空画布
    if (confirm('加载完整模板将清空当前画布，是否继续？')) {
      clearCanvas()
      
      const template = FULL_TEMPLATES[templateKey]
      const newComponents = template.create()
      
      // 添加所有组件
      newComponents.forEach((comp) => addComponent(comp))
    }
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">组件库</h2>

      {/* 标签切换 */}
      <div className="flex gap-1 mb-4 border-b">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 pb-2 text-xs font-medium ${
            activeTab === 'templates'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          模板
        </button>
        <button
          onClick={() => setActiveTab('full')}
          className={`flex-1 pb-2 text-xs font-medium ${
            activeTab === 'full'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          完整
        </button>
      </div>

      {activeTab === 'templates' ? (
        <>
          {/* 模板库 */}
          <div className="space-y-4">
            {/* 简历头部 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">简历头部</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('resumeHeader1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="10" y="4" width="20" height="3" fill="#3b82f6" rx="1"/>
                    <rect x="12" y="10" width="16" height="2" fill="#9ca3af" rx="1"/>
                    <rect x="14" y="15" width="12" height="2" fill="#d1d5db" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">居中</div>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="20" height="3" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="10" width="16" height="2" fill="#9ca3af" rx="1"/>
                    <rect x="2" y="15" width="12" height="2" fill="#d1d5db" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">左对齐</div>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="0" y="0" width="40" height="24" fill="#e0e7ff" rx="2"/>
                    <rect x="10" y="6" width="20" height="3" fill="#3b82f6" rx="1"/>
                    <rect x="12" y="12" width="16" height="2" fill="#6366f1" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">带背景</div>
                </button>
              </div>
            </div>

            {/* 联系信息 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">联系信息</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('contactInfo1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="12" r="2" fill="#3b82f6"/>
                    <rect x="9" y="11" width="6" height="2" fill="#9ca3af" rx="1"/>
                    <circle cx="20" cy="12" r="2" fill="#3b82f6"/>
                    <rect x="23" y="11" width="6" height="2" fill="#9ca3af" rx="1"/>
                    <circle cx="34" cy="12" r="2" fill="#3b82f6"/>
                  </svg>
                  <div className="text-xs font-medium">横向</div>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="6" r="2" fill="#3b82f6"/>
                    <rect x="10" y="5" width="12" height="2" fill="#9ca3af" rx="1"/>
                    <circle cx="6" cy="12" r="2" fill="#3b82f6"/>
                    <rect x="10" y="11" width="12" height="2" fill="#9ca3af" rx="1"/>
                    <circle cx="6" cy="18" r="2" fill="#3b82f6"/>
                    <rect x="10" y="17" width="12" height="2" fill="#9ca3af" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">纵向</div>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="16" height="8" fill="#f3f4f6" stroke="#d1d5db" rx="2"/>
                    <circle cx="6" cy="8" r="1.5" fill="#3b82f6"/>
                    <rect x="9" y="7" width="7" height="2" fill="#9ca3af" rx="1"/>
                    <rect x="22" y="4" width="16" height="8" fill="#f3f4f6" stroke="#d1d5db" rx="2"/>
                    <circle cx="26" cy="8" r="1.5" fill="#3b82f6"/>
                    <rect x="29" y="7" width="7" height="2" fill="#9ca3af" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">卡片</div>
                </button>
              </div>
            </div>

            {/* 个人简介 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">个人简介</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addTemplate('summary1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="9" width="36" height="1.5" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="13" width="36" height="1.5" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="17" width="28" height="1.5" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">标准</div>
                </button>
                <button
                  onClick={() => addTemplate('summary2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="0" y="2" width="40" height="20" fill="#eff6ff" rx="2"/>
                    <rect x="4" y="6" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="4" y="11" width="32" height="1.5" fill="#93c5fd" rx="0.5"/>
                    <rect x="4" y="15" width="28" height="1.5" fill="#93c5fd" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">高亮</div>
                </button>
              </div>
            </div>

            {/* 技能标签 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">技能标签</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('skillTags1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="8" width="10" height="4" fill="#e0e7ff" rx="1"/>
                    <rect x="14" y="8" width="10" height="4" fill="#e0e7ff" rx="1"/>
                    <rect x="26" y="8" width="10" height="4" fill="#e0e7ff" rx="1"/>
                    <rect x="8" y="14" width="10" height="4" fill="#e0e7ff" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">扁平</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="8" width="10" height="4" fill="#dbeafe" stroke="#3b82f6" rx="2"/>
                    <rect x="14" y="8" width="10" height="4" fill="#dbeafe" stroke="#3b82f6" rx="2"/>
                    <rect x="26" y="8" width="10" height="4" fill="#dbeafe" stroke="#3b82f6" rx="2"/>
                    <rect x="8" y="14" width="10" height="4" fill="#dbeafe" stroke="#3b82f6" rx="2"/>
                  </svg>
                  <div className="text-xs font-medium">胶囊</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="6" width="36" height="3" fill="#f3f4f6" rx="1.5"/>
                    <rect x="2" y="6" width="24" height="3" fill="#3b82f6" rx="1.5"/>
                    <rect x="2" y="12" width="36" height="3" fill="#f3f4f6" rx="1.5"/>
                    <rect x="2" y="12" width="18" height="3" fill="#3b82f6" rx="1.5"/>
                  </svg>
                  <div className="text-xs font-medium">进度条</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags4')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <text x="2" y="10" fontSize="8" fill="#1f2937">技能：</text>
                    <text x="2" y="17" fontSize="6" fill="#6b7280">A, B, C, D</text>
                  </svg>
                  <div className="text-xs font-medium">逗号</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags5')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <text x="2" y="14" fontSize="7" fill="#1f2937">A | B | C | D</text>
                  </svg>
                  <div className="text-xs font-medium">竖线</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags6')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <text x="2" y="10" fontSize="7" fill="#1f2937">• A • B • C</text>
                    <text x="2" y="17" fontSize="7" fill="#1f2937">• D • E • F</text>
                  </svg>
                  <div className="text-xs font-medium">符号</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags7')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <text x="2" y="8" fontSize="6" fill="#1f2937">• 前端框架</text>
                    <text x="2" y="14" fontSize="6" fill="#1f2937">• 编程语言</text>
                    <text x="2" y="20" fontSize="6" fill="#1f2937">• 容器技术</text>
                  </svg>
                  <div className="text-xs font-medium">列表</div>
                </button>
              </div>
            </div>

            {/* 工作经历 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">工作经历</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('workExperience1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="3" width="36" height="18" fill="#f9fafb" stroke="#e5e7eb" rx="2"/>
                    <rect x="5" y="6" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="5" y="10" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="5" y="14" width="28" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="5" y="17" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('workExperience2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="6" r="2" fill="#3b82f6"/>
                    <line x1="6" y1="8" x2="6" y2="20" stroke="#d1d5db" strokeWidth="1.5"/>
                    <rect x="10" y="4" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="10" y="8" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                    <circle cx="6" cy="16" r="2" fill="#3b82f6"/>
                    <rect x="10" y="14" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="10" y="18" width="20" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">时间轴</div>
                </button>
                <button
                  onClick={() => addTemplate('workExperience3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="8" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="2" y="12" width="32" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="15" width="28" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="18" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">列表</div>
                </button>
              </div>
            </div>

            {/* 教育背景 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">教育背景</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('education1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="12" r="3" fill="#dbeafe" stroke="#3b82f6"/>
                    <path d="M 5 12 L 6 13 L 7.5 11" stroke="#3b82f6" strokeWidth="1" fill="none"/>
                    <rect x="11" y="8" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="11" y="12" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="11" y="16" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">图标</div>
                </button>
                <button
                  onClick={() => addTemplate('education2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="36" height="16" fill="#f9fafb" stroke="#e5e7eb" rx="2"/>
                    <rect x="5" y="7" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="5" y="11" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="5" y="15" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('education3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="5" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="9" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="2" y="13" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="17" width="10" height="1.5" fill="#9ca3af" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">列表</div>
                </button>
              </div>
            </div>

            {/* 项目经验 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">项目经验</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('project1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="4" width="20" height="3" fill="#dbeafe" rx="1"/>
                    <rect x="5" y="5.5" width="14" height="1.5" fill="#3b82f6" rx="0.5"/>
                    <rect x="2" y="10" width="32" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="13" width="28" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="2" y="16" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">标题</div>
                </button>
                <button
                  onClick={() => addTemplate('project2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="3" width="36" height="18" fill="#f9fafb" stroke="#e5e7eb" rx="2"/>
                    <rect x="5" y="6" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="22" y="6" width="12" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <rect x="5" y="11" width="28" height="1" fill="#d1d5db" rx="0.5"/>
                    <rect x="5" y="14" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('project3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="7" r="2" fill="#3b82f6"/>
                    <line x1="6" y1="9" x2="6" y2="18" stroke="#d1d5db" strokeWidth="1.5"/>
                    <rect x="10" y="5" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="10" y="9" width="24" height="1" fill="#d1d5db" rx="0.5"/>
                    <circle cx="6" cy="17" r="2" fill="#3b82f6"/>
                  </svg>
                  <div className="text-xs font-medium">时间轴</div>
                </button>
              </div>
            </div>

            {/* 其他 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">其他</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addTemplate('awards1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <circle cx="6" cy="8" r="2.5" fill="#fef3c7" stroke="#f59e0b"/>
                    <path d="M 6 6.5 L 6.8 8.5 L 5.2 8.5 Z" fill="#f59e0b"/>
                    <rect x="10" y="7" width="24" height="1.5" fill="#9ca3af" rx="0.5"/>
                    <circle cx="6" cy="16" r="2.5" fill="#fef3c7" stroke="#f59e0b"/>
                    <path d="M 6 14.5 L 6.8 16.5 L 5.2 16.5 Z" fill="#f59e0b"/>
                    <rect x="10" y="15" width="20" height="1.5" fill="#9ca3af" rx="0.5"/>
                  </svg>
                  <div className="text-xs font-medium">荣誉奖项</div>
                </button>
                <button
                  onClick={() => addTemplate('languages1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="6" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="16" y="6" width="20" height="2" fill="#e5e7eb" rx="1"/>
                    <rect x="16" y="6" width="14" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="2" y="12" width="12" height="2" fill="#3b82f6" rx="1"/>
                    <rect x="16" y="12" width="20" height="2" fill="#e5e7eb" rx="1"/>
                    <rect x="16" y="12" width="10" height="2" fill="#3b82f6" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">语言能力</div>
                </button>
              </div>
            </div>

            {/* 页面元素 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">页面元素</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('pageBorder1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="2" y="2" width="36" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">边框</div>
                </button>
                <button
                  onClick={() => addTemplate('header1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <rect x="0" y="0" width="40" height="6" fill="#f3f4f6"/>
                    <rect x="4" y="2" width="12" height="2" fill="#9ca3af" rx="1"/>
                    <line x1="0" y1="6" x2="40" y2="6" stroke="#d1d5db" strokeWidth="1"/>
                  </svg>
                  <div className="text-xs font-medium">页眉</div>
                </button>
                <button
                  onClick={() => addTemplate('footer1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center gap-1"
                >
                  <svg width="40" height="24" viewBox="0 0 40 24" className="mb-1">
                    <line x1="0" y1="18" x2="40" y2="18" stroke="#d1d5db" strokeWidth="1"/>
                    <rect x="0" y="18" width="40" height="6" fill="#f3f4f6"/>
                    <rect x="14" y="20" width="12" height="2" fill="#9ca3af" rx="1"/>
                  </svg>
                  <div className="text-xs font-medium">页脚</div>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 完整模板 */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800 font-medium mb-1">💡 一键生成完整简历</p>
              <p className="text-xs text-blue-600">选择风格后将清空画布并加载完整模板</p>
            </div>

            {/* 现代风格 */}
            <button
              onClick={() => addFullTemplate('modern')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">现代风格</h4>
                  <p className="text-xs text-gray-600 mb-2">时尚现代，适合互联网行业</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded">居中头部</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded">时间轴</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded">胶囊标签</span>
                  </div>
                </div>
              </div>
            </button>

            {/* 经典风格 */}
            <button
              onClick={() => addFullTemplate('classic')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">📋</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">经典风格</h4>
                  <p className="text-xs text-gray-600 mb-2">传统稳重，适合传统行业</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded">左对齐</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded">列表式</span>
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-700 rounded">扁平标签</span>
                  </div>
                </div>
              </div>
            </button>

            {/* 简约风格 */}
            <button
              onClick={() => addFullTemplate('minimal')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">✨</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">简约风格</h4>
                  <p className="text-xs text-gray-600 mb-2">简洁清爽，突出重点</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded">居中头部</span>
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded">卡片式</span>
                    <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded">含奖项</span>
                  </div>
                </div>
              </div>
            </button>

            {/* 专业风格 */}
            <button
              onClick={() => addFullTemplate('professional')}
              className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl">👔</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-800 mb-1">专业风格</h4>
                  <p className="text-xs text-gray-600 mb-2">正式专业，带页眉页脚</p>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">带背景</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">页眉页脚</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">进度条</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* 提示 */}
          <div className="mt-6 p-3 bg-amber-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">⚠️ 注意:</p>
            <p>加载完整模板会清空当前画布内容，请先保存当前工作</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ComponentLibrary
