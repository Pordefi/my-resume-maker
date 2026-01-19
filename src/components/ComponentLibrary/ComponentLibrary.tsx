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
            {/* 简历头部 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">简历头部</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('resumeHeader1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">居中式</span>
                  <p className="text-gray-500 text-[10px]">经典居中布局</p>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">左对齐</span>
                  <p className="text-gray-500 text-[10px]">带装饰线</p>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">带背景</span>
                  <p className="text-gray-500 text-[10px]">深色背景</p>
                </button>
              </div>
            </div>

            {/* 联系信息 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">联系信息</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('contactInfo1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">横向排列</span>
                  <p className="text-gray-500 text-[10px]">图标+文本</p>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">纵向列表</span>
                  <p className="text-gray-500 text-[10px]">标签+内容</p>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">卡片式</span>
                  <p className="text-gray-500 text-[10px]">卡片布局</p>
                </button>
              </div>
            </div>

            {/* 技能标签 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">技能标签</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('skillTags1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">扁平风格</span>
                  <p className="text-gray-500 text-[10px]">现代扁平设计</p>
                </button>
                <button
                  onClick={() => addTemplate('skillTags2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">胶囊风格</span>
                  <p className="text-gray-500 text-[10px]">圆角胶囊标签</p>
                </button>
                <button
                  onClick={() => addTemplate('skillTags3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">进度条</span>
                  <p className="text-gray-500 text-[10px]">带熟练度显示</p>
                </button>
              </div>
            </div>

            {/* 工作经历 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">工作经历</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('workExperience1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">卡片式</span>
                  <p className="text-gray-500 text-[10px]">带边框卡片</p>
                </button>
                <button
                  onClick={() => addTemplate('workExperience2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">时间轴</span>
                  <p className="text-gray-500 text-[10px]">垂直时间线</p>
                </button>
                <button
                  onClick={() => addTemplate('workExperience3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">简洁列表</span>
                  <p className="text-gray-500 text-[10px]">极简风格</p>
                </button>
              </div>
            </div>

            {/* 教育背景 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">教育背景</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('education1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">带图标</span>
                  <p className="text-gray-500 text-[10px]">图标+信息</p>
                </button>
                <button
                  onClick={() => addTemplate('education2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">卡片式</span>
                  <p className="text-gray-500 text-[10px]">背景卡片</p>
                </button>
                <button
                  onClick={() => addTemplate('education3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">简洁列表</span>
                  <p className="text-gray-500 text-[10px]">极简风格</p>
                </button>
              </div>
            </div>

            {/* 项目经验 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">项目经验</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('project1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">标题背景</span>
                  <p className="text-gray-500 text-[10px]">带链接</p>
                </button>
                <button
                  onClick={() => addTemplate('project2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">卡片式</span>
                  <p className="text-gray-500 text-[10px]">角色+时间</p>
                </button>
                <button
                  onClick={() => addTemplate('project3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">时间轴</span>
                  <p className="text-gray-500 text-[10px]">带链接</p>
                </button>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">个人简介</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('summary1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">标准样式</span>
                  <p className="text-gray-500 text-[10px]">标题+内容</p>
                </button>
                <button
                  onClick={() => addTemplate('summary2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">高亮样式</span>
                  <p className="text-gray-500 text-[10px]">带背景色</p>
                </button>
              </div>
            </div>

            {/* 荣誉奖项 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">荣誉奖项</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('awards1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">列表样式</span>
                  <p className="text-gray-500 text-[10px]">图标+奖项</p>
                </button>
              </div>
            </div>

            {/* 语言能力 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">语言能力</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('languages1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">列表样式</span>
                  <p className="text-gray-500 text-[10px]">语言+等级</p>
                </button>
              </div>
            </div>

            {/* 双栏布局 */}
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">双栏布局</h4>
              <div className="space-y-2">
                <button
                  onClick={() => addTemplate('twoColumnLayout1')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">左侧深色</span>
                  <p className="text-gray-500 text-[10px]">左栏深色背景</p>
                </button>
                <button
                  onClick={() => addTemplate('twoColumnLayout2')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">左侧浅色</span>
                  <p className="text-gray-500 text-[10px]">左栏浅色背景</p>
                </button>
                <button
                  onClick={() => addTemplate('twoColumnLayout3')}
                  className="w-full p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-left text-xs"
                >
                  <span className="font-medium">右侧深色</span>
                  <p className="text-gray-500 text-[10px]">右栏深色背景</p>
                </button>
              </div>
            </div>
          </div>

          {/* 提示 */}
          <div className="mt-6 p-3 bg-amber-50 rounded text-xs text-gray-600">
            <p className="font-medium mb-1">💡 提示:</p>
            <p>每个模板都有多种样式可选，点击即可添加到画布</p>
          </div>
        </>
      )}
    </div>
  )
}

export default ComponentLibrary
