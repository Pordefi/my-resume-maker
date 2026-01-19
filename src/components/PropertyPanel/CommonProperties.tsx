import { useCanvasStore } from '@/store/canvasStore'
import { Lock, Unlock, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'

const CommonProperties = () => {
  const { components, selectedIds, updateComponent, bringToFront, sendToBack } =
    useCanvasStore()

  if (selectedIds.length === 0) return null

  const selectedComponents = components.filter((c) => selectedIds.includes(c.id))
  const component = selectedComponents[0]

  const handleChange = (field: string, value: any) => {
    selectedIds.forEach((id) => {
      updateComponent(id, { [field]: value })
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">通用属性</h3>

      {/* 位置和尺寸 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">X</label>
          <input
            type="number"
            value={Math.round(component.x)}
            onChange={(e) => handleChange('x', Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Y</label>
          <input
            type="number"
            value={Math.round(component.y)}
            onChange={(e) => handleChange('y', Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">宽度</label>
          <input
            type="number"
            value={Math.round(component.width)}
            onChange={(e) => handleChange('width', Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">高度</label>
          <input
            type="number"
            value={Math.round(component.height)}
            onChange={(e) => handleChange('height', Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
      </div>

      {/* 旋转 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">旋转角度</label>
        <input
          type="number"
          value={Math.round(component.rotation)}
          onChange={(e) => handleChange('rotation', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>

      {/* 层级控制 */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">层级</label>
        <div className="flex gap-2">
          <button
            onClick={() => bringToFront(component.id)}
            className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
          >
            <ArrowUp size={14} />
            置顶
          </button>
          <button
            onClick={() => sendToBack(component.id)}
            className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50 flex items-center justify-center gap-1"
          >
            <ArrowDown size={14} />
            置底
          </button>
        </div>
      </div>

      {/* 锁定和可见性 */}
      <div className="flex gap-2">
        <button
          onClick={() => handleChange('locked', !component.locked)}
          className={`flex-1 px-3 py-2 border rounded text-sm flex items-center justify-center gap-1 ${
            component.locked ? 'bg-red-50 border-red-300' : 'hover:bg-gray-50'
          }`}
        >
          {component.locked ? <Lock size={14} /> : <Unlock size={14} />}
          {component.locked ? '已锁定' : '未锁定'}
        </button>
        <button
          onClick={() => handleChange('visible', !component.visible)}
          className={`flex-1 px-3 py-2 border rounded text-sm flex items-center justify-center gap-1 ${
            !component.visible ? 'bg-gray-50 border-gray-300' : 'hover:bg-gray-50'
          }`}
        >
          {component.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          {component.visible ? '可见' : '隐藏'}
        </button>
      </div>
    </div>
  )
}

export default CommonProperties
