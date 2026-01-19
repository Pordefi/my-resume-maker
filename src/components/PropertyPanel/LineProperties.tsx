import { useCanvasStore } from '@/store/canvasStore'
import { LineComponent } from '@/types/canvas'

interface Props {
  component: LineComponent
}

const LineProperties = ({ component }: Props) => {
  const { updateComponent } = useCanvasStore()

  const handleChange = (field: keyof LineComponent, value: any) => {
    updateComponent(component.id, { [field]: value })
  }

  const toggleDashed = () => {
    if (component.dash.length > 0) {
      handleChange('dash', [])
    } else {
      handleChange('dash', [10, 5])
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">线条属性</h3>

      {/* 颜色 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={component.stroke}
            onChange={(e) => handleChange('stroke', e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={component.stroke}
            onChange={(e) => handleChange('stroke', e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </div>

      {/* 宽度 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">宽度</label>
        <input
          type="number"
          value={component.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
          min={1}
        />
      </div>

      {/* 虚线 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">样式</label>
        <button
          onClick={toggleDashed}
          className={`w-full px-3 py-2 border rounded text-sm ${
            component.dash.length > 0
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {component.dash.length > 0 ? '虚线' : '实线'}
        </button>
      </div>
    </div>
  )
}

export default LineProperties
