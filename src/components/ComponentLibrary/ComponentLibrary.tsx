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
import { TEMPLATES } from '@/utils/templates'

const ComponentLibrary = () => {
  const { addComponent } = useCanvasStore()
  const [activeTab, setActiveTab] = useState<'basic' | 'templates'>('basic')

  const addText = () => {
    addComponent(createTextComponent(100, 100))
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
    newComponents.forEach((comp) => addComponent(comp))
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">组件库</h2>

      {/* 标签切换 */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveTab('basic')}
          className={`flex-1 pb-2 text-sm font-medium ${
            activeTab === 'basic'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          基础组件
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 pb-2 text-sm font-medium ${
            activeTab === 'templates'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          模板
        </button>
      </div>

      {activeTab === 'basic' ? (
        <>
          {/* 基础组件 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">基础组件</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={addText}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Type size={24} className="mb-1" />
                <span className="text-xs">文本</span>
              </button>

              <button
                onClick={addImage}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Image size={24} className="mb-1" />
                <span className="text-xs">图片</span>
              </button>
            </div>
          </div>

          {/* 形状 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">形状</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addShape(ShapeType.RECTANGLE)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Square size={24} className="mb-1" />
                <span className="text-xs">矩形</span>
              </button>

              <button
                onClick={() => addShape(ShapeType.CIRCLE)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full border-2 border-current mb-1" />
                <span className="text-xs">圆形</span>
              </button>

              <button
                onClick={() => addShape(ShapeType.ELLIPSE)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-8 h-5 rounded-full border-2 border-current mb-1" />
                <span className="text-xs">椭圆</span>
              </button>
            </div>
          </div>

          {/* 线条 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">线条</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addLine(true)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Minus size={24} className="mb-1" />
                <span className="text-xs">水平线</span>
              </button>

              <button
                onClick={() => addLine(false)}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Minus size={24} className="mb-1 rotate-90" />
                <span className="text-xs">垂直线</span>
              </button>
            </div>
          </div>

          {/* 图标 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">图标</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={addIcon}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Star size={24} className="mb-1" />
                <span className="text-xs">图标</span>
              </button>
            </div>
          </div>

          {/* 提示 */}
          <div className="mt-8 p-3 bg-blue-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">快捷键:</p>
            <ul className="space-y-1">
              <li>双击文本编辑</li>
              <li>Ctrl+Z: 撤销</li>
              <li>Ctrl+C/V: 复制/粘贴</li>
              <li>Delete: 删除</li>
            </ul>
          </div>
        </>
      ) : (
        <>
          {/* 模板库 */}
          <div className="space-y-3">
            <button
              onClick={() => addTemplate('resumeHeader')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Layout size={18} className="text-blue-600" />
                <span className="text-sm font-medium">简历头部</span>
              </div>
              <p className="text-xs text-gray-500">姓名 + 职位 + 分隔线</p>
            </button>

            <button
              onClick={() => addTemplate('contactInfo')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Phone size={18} className="text-green-600" />
                <span className="text-sm font-medium">联系信息</span>
              </div>
              <p className="text-xs text-gray-500">电话、邮箱、地址等</p>
            </button>

            <button
              onClick={() => addTemplate('skillTags')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Code size={18} className="text-purple-600" />
                <span className="text-sm font-medium">技能标签</span>
              </div>
              <p className="text-xs text-gray-500">技能标签网格布局</p>
            </button>

            <button
              onClick={() => addTemplate('workExperience')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Briefcase size={18} className="text-orange-600" />
                <span className="text-sm font-medium">工作经历</span>
              </div>
              <p className="text-xs text-gray-500">工作经历卡片模板</p>
            </button>

            <button
              onClick={() => addTemplate('education')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap size={18} className="text-indigo-600" />
                <span className="text-sm font-medium">教育背景</span>
              </div>
              <p className="text-xs text-gray-500">学校、专业、时间</p>
            </button>

            <button
              onClick={() => addTemplate('project')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Award size={18} className="text-red-600" />
                <span className="text-sm font-medium">项目经验</span>
              </div>
              <p className="text-xs text-gray-500">项目卡片模板</p>
            </button>

            <button
              onClick={() => addTemplate('twoColumn')}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Layout size={18} className="text-gray-600" />
                <span className="text-sm font-medium">双栏布局</span>
              </div>
              <p className="text-xs text-gray-500">左右分栏背景</p>
            </button>
          </div>

          {/* 提示 */}
          <div className="mt-6 p-3 bg-amber-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">💡 提示:</p>
            <p>点击模板快速添加预设组件，可自由编辑和调整</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ComponentLibrary
