import { useCanvasStore } from '@/store/canvasStore'

const CanvasBackgroundProperties = () => {
  const { canvasBackgroundColor, setCanvasBackgroundColor } = useCanvasStore()

  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700 mb-3">画布背景</h3>
      
      <div>
        <label className="block text-xs text-gray-600 mb-1">背景颜色</label>
        <div className="flex gap-2">
          <input
            type="color"
            value={canvasBackgroundColor}
            onChange={(e) => setCanvasBackgroundColor(e.target.value)}
            className="w-12 h-8 border rounded cursor-pointer"
          />
          <input
            type="text"
            value={canvasBackgroundColor}
            onChange={(e) => setCanvasBackgroundColor(e.target.value)}
            className="flex-1 px-2 py-1 border rounded text-sm font-mono"
          />
        </div>
      </div>

      {/* 预设颜色 */}
      <div className="mt-3">
        <label className="block text-xs text-gray-600 mb-2">预设颜色</label>
        <div className="grid grid-cols-6 gap-2">
          {[
            '#ffffff',
            '#f3f4f6',
            '#e5e7eb',
            '#fef3c7',
            '#dbeafe',
            '#fce7f3',
            '#dcfce7',
            '#fed7aa',
            '#e0e7ff',
            '#fecaca',
            '#1f2937',
            '#000000',
          ].map((color) => (
            <button
              key={color}
              onClick={() => setCanvasBackgroundColor(color)}
              className={`w-8 h-8 rounded border-2 transition-all ${
                canvasBackgroundColor === color
                  ? 'border-blue-500 scale-110'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default CanvasBackgroundProperties
