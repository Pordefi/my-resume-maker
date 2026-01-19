import { useCanvasStore } from '@/store/canvasStore'
import { CanvasComponent } from '@/types/canvas'

interface Props {
  component: CanvasComponent
}

const ShadowProperties = ({ component }: Props) => {
  const { updateComponent } = useCanvasStore()

  const shadow = component.shadow || {
    enabled: false,
    color: '#000000',
    blur: 10,
    offsetX: 5,
    offsetY: 5,
    opacity: 0.5,
  }

  const handleShadowChange = (field: string, value: any) => {
    updateComponent(component.id, {
      shadow: {
        ...shadow,
        [field]: value,
      },
    })
  }

  const toggleShadow = () => {
    handleShadowChange('enabled', !shadow.enabled)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium text-gray-700">阴影</h4>
        <button
          onClick={toggleShadow}
          className={`px-3 py-1 border rounded text-xs ${
            shadow.enabled
              ? 'bg-blue-500 text-white'
              : 'hover:bg-gray-50'
          }`}
        >
          {shadow.enabled ? '已启用' : '已禁用'}
        </button>
      </div>

      {shadow.enabled && (
        <>
          <div>
            <label className="block text-xs text-gray-600 mb-1">颜色</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={shadow.color}
                onChange={(e) => handleShadowChange('color', e.target.value)}
                className="w-12 h-8 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={shadow.color}
                onChange={(e) => handleShadowChange('color', e.target.value)}
                className="flex-1 px-2 py-1 border rounded text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              模糊: {shadow.blur}px
            </label>
            <input
              type="range"
              value={shadow.blur}
              onChange={(e) => handleShadowChange('blur', Number(e.target.value))}
              className="w-full"
              min={0}
              max={50}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 mb-1">X偏移</label>
              <input
                type="number"
                value={shadow.offsetX}
                onChange={(e) => handleShadowChange('offsetX', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
                min={-50}
                max={50}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Y偏移</label>
              <input
                type="number"
                value={shadow.offsetY}
                onChange={(e) => handleShadowChange('offsetY', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
                min={-50}
                max={50}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              不透明度: {Math.round(shadow.opacity * 100)}%
            </label>
            <input
              type="range"
              value={shadow.opacity}
              onChange={(e) => handleShadowChange('opacity', Number(e.target.value))}
              className="w-full"
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default ShadowProperties
