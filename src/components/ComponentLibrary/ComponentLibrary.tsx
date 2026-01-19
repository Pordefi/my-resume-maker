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
    
    // 添加所有组件
    newComponents.forEach((comp) => addComponent(comp))
    
    // 自动创建组
    if (newComponents.length >= 2) {
      // 等待组件添加完成后创建组
      setTimeout(() => {
        const store = useCanvasStore.getState()
        const componentIds = newComponents.map((c) => c.id)
        
        // 选中这些组件
        store.clearSelection()
        componentIds.forEach((id) => store.selectComponent(id, true))
        
        // 创建组
        store.createGroup(template.name)
        
        // 取消选择
        store.clearSelection()
      }, 50)
    }
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

          {/* 线条与分割线 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">线条与分割线</h3>
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
              
              <button
                onClick={() => {
                  const { canvasWidth } = useCanvasStore.getState()
                  const dividerWidth = Math.floor(canvasWidth * 0.8)
                  const divider = createLineComponent(100, 100, true)
                  divider.width = dividerWidth
                  divider.points = [0, 0, dividerWidth, 0]
                  divider.stroke = '#e5e7eb'
                  divider.strokeWidth = 1
                  addComponent(divider)
                }}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-full h-px bg-gray-300 mb-1" />
                <span className="text-xs">细分割线</span>
              </button>
              
              <button
                onClick={() => {
                  const { canvasWidth } = useCanvasStore.getState()
                  const dividerWidth = Math.floor(canvasWidth * 0.8)
                  const divider = createLineComponent(100, 100, true)
                  divider.width = dividerWidth
                  divider.points = [0, 0, dividerWidth, 0]
                  divider.stroke = '#3b82f6'
                  divider.strokeWidth = 2
                  addComponent(divider)
                }}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-full h-0.5 bg-blue-500 mb-1" />
                <span className="text-xs">粗分割线</span>
              </button>
              
              <button
                onClick={() => {
                  const { canvasWidth } = useCanvasStore.getState()
                  const dividerWidth = Math.floor(canvasWidth * 0.8)
                  const divider = createLineComponent(100, 100, true)
                  divider.width = dividerWidth
                  divider.points = [0, 0, dividerWidth, 0]
                  divider.stroke = '#d1d5db'
                  divider.strokeWidth = 1
                  divider.dash = [5, 5]
                  addComponent(divider)
                }}
                className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-full h-px border-t border-dashed border-gray-400 mb-1" />
                <span className="text-xs">虚线</span>
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
          <div className="space-y-4">
            {/* 简历头部 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">简历头部</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('resumeHeader1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">居中</div>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">左对齐</div>
                </button>
                <button
                  onClick={() => addTemplate('resumeHeader3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">横向</div>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">纵向</div>
                </button>
                <button
                  onClick={() => addTemplate('contactInfo3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">标准</div>
                </button>
                <button
                  onClick={() => addTemplate('summary2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">扁平</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">胶囊</div>
                </button>
                <button
                  onClick={() => addTemplate('skillTags3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">进度条</div>
                </button>
              </div>
            </div>

            {/* 工作经历 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">工作经历</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('workExperience1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('workExperience2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">时间轴</div>
                </button>
                <button
                  onClick={() => addTemplate('workExperience3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">图标</div>
                </button>
                <button
                  onClick={() => addTemplate('education2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('education3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">标题</div>
                </button>
                <button
                  onClick={() => addTemplate('project2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">卡片</div>
                </button>
                <button
                  onClick={() => addTemplate('project3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
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
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">荣誉奖项</div>
                </button>
                <button
                  onClick={() => addTemplate('languages1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">语言能力</div>
                </button>
              </div>
            </div>

            {/* 布局 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">布局</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('twoColumnLayout1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">左深色</div>
                </button>
                <button
                  onClick={() => addTemplate('twoColumnLayout2')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">左浅色</div>
                </button>
                <button
                  onClick={() => addTemplate('twoColumnLayout3')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">右深色</div>
                </button>
              </div>
            </div>

            {/* 页面元素 */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 mb-2">页面元素</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addTemplate('pageBorder1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">边框</div>
                </button>
                <button
                  onClick={() => addTemplate('header1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">页眉</div>
                </button>
                <button
                  onClick={() => addTemplate('footer1')}
                  className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors text-center"
                >
                  <div className="text-xs font-medium">页脚</div>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ComponentLibrary
