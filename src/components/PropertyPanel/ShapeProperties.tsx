import { useCanvasStore } from '@/store/canvasStore'
import { ShapeComponent, ShapeType } from '@/types/canvas'

interface Props {
  component: ShapeComponent
}

const ShapeProperties = ({ component }: Props) => {
  const { updateComponent } = useCanvasStore()

  const handleChange = (field: keyof ShapeComponent, value: any) => {
    updateComponent(component.id, { [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">形状属性</h3>

      {/* 形状类型 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">形状类型</label>
        <select
          value={component.shapeType}
          onChange={(e) => handleChange('shapeType', e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        >
          <option value={ShapeType.RECTANGLE}>矩形</option>
          <option value={ShapeType.CIRCLE}>圆形</option>
          <option value={ShapeType.ELLIPSE}>椭圆</option>
        </select>
      </div>

      {/* 填充颜色 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">填充颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={component.fill}
            onChange={(e) => handleChange('fill', e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={component.fill}
            onChange={(e) => handleChange('fill', e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </div>

      {/* 边框颜色 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">边框颜色</label>
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

      {/* 边框宽度 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">边框宽度</label>
        <input
          type="number"
          value={component.strokeWidth}
          onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
          min={0}
        />
      </div>

      {/* 透明度 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">
          透明度: {Math.round(component.opacity * 100)}%
        </label>
        <input
          type="range"
          value={component.opacity}
          onChange={(e) => handleChange('opacity', Number(e.target.value))}
          className="w-full"
          min={0}
          max={1}
          step={0.01}
        />
      </div>

      {/* 圆角 (仅矩形) */}
      {component.shapeType === ShapeType.RECTANGLE && (
        <div>
          <label className="block text-xs text-gray-600 mb-1">圆角</label>
          <input
            type="number"
            value={component.borderRadius}
            onChange={(e) => handleChange('borderRadius', Number(e.target.value))}
            className="w-full px-2 py-1 border rounded text-sm"
            min={0}
          />
        </div>
      )}

      {/* 内嵌文本 */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-xs font-medium text-gray-700 mb-2">内嵌文本</h4>
        
        <div>
          <label className="block text-xs text-gray-600 mb-1">文本内容</label>
          <textarea
            value={component.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
            rows={2}
            placeholder="输入文本..."
          />
        </div>

        {component.text && (
          <>
            <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">字体大小</label>
              <input
                type="number"
                value={component.fontSize || 16}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="w-full px-2 py-1 border rounded text-sm"
                min={8}
                max={100}
              />
            </div>

            <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">文本颜色</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={component.textColor || '#000000'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="w-12 h-8 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={component.textColor || '#000000'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">对齐</label>
              <div className="flex gap-1">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => handleChange('textAlign', align)}
                    className={`flex-1 px-2 py-1 border rounded text-sm ${
                      (component.textAlign || 'center') === align
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {align === 'left' ? '左' : align === 'center' ? '中' : '右'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-xs text-gray-600 mb-1">粗细</label>
              <select
                value={component.fontWeight || 'normal'}
                onChange={(e) => handleChange('fontWeight', e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="normal">正常</option>
                <option value="bold">粗体</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ShapeProperties
