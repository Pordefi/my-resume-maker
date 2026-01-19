import { useCanvasStore } from '@/store/canvasStore'
import { ImageComponent } from '@/types/canvas'

interface Props {
  component: ImageComponent
}

const ImageProperties = ({ component }: Props) => {
  const { updateComponent } = useCanvasStore()

  const handleChange = (field: keyof ImageComponent, value: any) => {
    updateComponent(component.id, { [field]: value })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const src = event.target?.result as string
        handleChange('src', src)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">图片属性</h3>

      {/* 图片预览 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">预览</label>
        <div className="w-full h-32 border rounded overflow-hidden bg-gray-50 flex items-center justify-center">
          {component.src ? (
            <img
              src={component.src}
              alt="预览"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-gray-400 text-sm">无图片</span>
          )}
        </div>
      </div>

      {/* 更换图片 */}
      <div>
        <label className="block text-xs text-gray-600 mb-1">更换图片</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full text-sm"
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

      {/* 圆角 */}
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
    </div>
  )
}

export default ImageProperties
