import { useCanvasStore } from '@/store/canvasStore'
import { TextComponent } from '@/types/canvas'

interface Props {
  component: TextComponent
}

const TextProperties = ({ component }: Props) => {
  const { updateComponent } = useCanvasStore()

  const handleChange = (field: keyof TextComponent, value: any) => {
    updateComponent(component.id, { [field]: value })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">文本属性</h3>

      {/* 文本内容 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">文本内容</label>
        <textarea
          value={component.text}
          onChange={(e) => handleChange('text', e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
          rows={3}
        />
      </div>

      {/* 字体 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">字体</label>
        <select
          value={component.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full px-2 py-1 border rounded text-sm"
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Microsoft YaHei', sans-serif">微软雅黑</option>
          <option value="'SimSun', serif">宋体</option>
          <option value="'SimHei', sans-serif">黑体</option>
          <option value="'KaiTi', serif">楷体</option>
        </select>
      </div>

      {/* 字体大小 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">字体大小</label>
        <input
          type="number"
          value={component.fontSize}
          onChange={(e) => handleChange('fontSize', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
          min={8}
          max={200}
        />
      </div>

      {/* 字体样式 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">粗细</label>
          <select
            value={component.fontWeight}
            onChange={(e) => handleChange('fontWeight', e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="normal">正常</option>
            <option value="bold">粗体</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">样式</label>
          <select
            value={component.fontStyle}
            onChange={(e) => handleChange('fontStyle', e.target.value)}
            className="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="normal">正常</option>
            <option value="italic">斜体</option>
          </select>
        </div>
      </div>

      {/* 对齐方式 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">对齐</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => handleChange('textAlign', align)}
              className={`flex-1 px-2 py-1 border rounded text-sm ${
                component.textAlign === align
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-gray-50'
              }`}
            >
              {align === 'left' ? '左' : align === 'center' ? '中' : '右'}
            </button>
          ))}
        </div>
      </div>

      {/* 颜色 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={component.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={component.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </div>

      {/* 行高 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">行高</label>
        <input
          type="number"
          value={component.lineHeight}
          onChange={(e) => handleChange('lineHeight', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
          min={0.5}
          max={3}
          step={0.1}
        />
      </div>

      {/* 字间距 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">字间距</label>
        <input
          type="number"
          value={component.letterSpacing}
          onChange={(e) => handleChange('letterSpacing', Number(e.target.value))}
          className="w-full px-2 py-1 border rounded text-sm"
          min={-5}
          max={20}
        />
      </div>
    </div>
  )
}

export default TextProperties
