import { useCanvasStore } from '@/store/canvasStore'
import { ComponentType } from '@/types/canvas'
import TextProperties from './TextProperties'
import ImageProperties from './ImageProperties'
import ShapeProperties from './ShapeProperties'
import LineProperties from './LineProperties'
import CommonProperties from './CommonProperties'
import ShadowProperties from './ShadowProperties'

const PropertyPanel = () => {
  const { components, selectedIds } = useCanvasStore()

  if (selectedIds.length === 0) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <p>未选择组件</p>
          <p className="text-sm mt-2">点击画布上的组件进行编辑</p>
        </div>
      </div>
    )
  }

  if (selectedIds.length > 1) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <h2 className="text-lg font-semibold mb-4">多选 ({selectedIds.length})</h2>
        <CommonProperties />
      </div>
    )
  }

  const component = components.find((c) => c.id === selectedIds[0])
  if (!component) return null

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">属性面板</h2>

      <CommonProperties />

      <div className="mt-4 pt-4 border-t">
        {component.type === ComponentType.TEXT && (
          <TextProperties component={component} />
        )}
        {component.type === ComponentType.IMAGE && (
          <ImageProperties component={component} />
        )}
        {component.type === ComponentType.SHAPE && (
          <ShapeProperties component={component} />
        )}
        {component.type === ComponentType.LINE && (
          <LineProperties component={component} />
        )}
      </div>

      {/* 阴影设置 */}
      {component.type !== ComponentType.LINE && (
        <div className="mt-4 pt-4 border-t">
          <ShadowProperties component={component} />
        </div>
      )}
    </div>
  )
}

export default PropertyPanel
