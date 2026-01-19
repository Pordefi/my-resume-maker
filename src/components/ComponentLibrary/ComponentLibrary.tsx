import { Type, Image, Square, Minus, Star } from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import {
  createTextComponent,
  createImageComponent,
  createShapeComponent,
  createLineComponent,
  createIconComponent,
} from '@/utils/componentFactory'
import { ShapeType } from '@/types/canvas'

const ComponentLibrary = () => {
  const { addComponent } = useCanvasStore()

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

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">组件库</h2>

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
          <li>Ctrl+Z: 撤销</li>
          <li>Ctrl+C/V: 复制/粘贴</li>
          <li>Delete: 删除</li>
          <li>Ctrl+A: 全选</li>
        </ul>
      </div>
    </div>
  )
}

export default ComponentLibrary
