import { Rect } from 'react-konva'
import { useCanvasStore } from '@/store/canvasStore'

const SelectionBox = () => {
  const { components, selectedIds } = useCanvasStore()

  if (selectedIds.length === 0) return null

  const selectedComponents = components.filter((c) =>
    selectedIds.includes(c.id)
  )

  if (selectedComponents.length === 0) return null

  // 计算包围盒
  const minX = Math.min(...selectedComponents.map((c) => c.x))
  const minY = Math.min(...selectedComponents.map((c) => c.y))
  const maxX = Math.max(...selectedComponents.map((c) => c.x + c.width))
  const maxY = Math.max(...selectedComponents.map((c) => c.y + c.height))

  return (
    <Rect
      x={minX}
      y={minY}
      width={maxX - minX}
      height={maxY - minY}
      stroke="#0ea5e9"
      strokeWidth={2}
      dash={[5, 5]}
      listening={false}
    />
  )
}

export default SelectionBox
