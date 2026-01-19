import { useRef, useEffect } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import { useCanvasStore } from '@/store/canvasStore'
import { CANVAS_CONFIG } from '@/types/canvas'
import CanvasComponent from './CanvasComponent'
import SelectionBox from './SelectionBox'

const Canvas = () => {
  const stageRef = useRef<any>(null)
  const {
    components,
    selectedIds,
    zoom,
    showGrid,
    clearSelection,
  } = useCanvasStore()

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useCanvasStore.getState()
      
      // Ctrl/Cmd + Z: 撤销
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        store.undo()
      }
      
      // Ctrl/Cmd + Shift + Z: 重做
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        store.redo()
      }
      
      // Ctrl/Cmd + C: 复制
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault()
        store.copy()
      }
      
      // Ctrl/Cmd + V: 粘贴
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault()
        store.paste()
      }
      
      // Ctrl/Cmd + X: 剪切
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault()
        store.cut()
      }
      
      // Ctrl/Cmd + A: 全选
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault()
        store.selectAll()
      }
      
      // Delete/Backspace: 删除
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        store.deleteSelectedComponents()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 渲染网格
  const renderGrid = () => {
    if (!showGrid) return null

    const lines = []
    const { width, height, gridSize } = CANVAS_CONFIG

    // 垂直线
    for (let i = 0; i <= width; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#e5e7eb"
          strokeWidth={1}
          listening={false}
        />
      )
    }

    // 水平线
    for (let i = 0; i <= height; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#e5e7eb"
          strokeWidth={1}
          listening={false}
        />
      )
    }

    return lines
  }

  // 点击空白处取消选择
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      clearSelection()
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-8">
      <div
        className="mx-auto shadow-2xl"
        style={{
          width: CANVAS_CONFIG.width * zoom,
          height: CANVAS_CONFIG.height * zoom,
        }}
      >
        <Stage
          ref={stageRef}
          width={CANVAS_CONFIG.width}
          height={CANVAS_CONFIG.height}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {/* 背景 */}
            <Rect
              x={0}
              y={0}
              width={CANVAS_CONFIG.width}
              height={CANVAS_CONFIG.height}
              fill={CANVAS_CONFIG.backgroundColor}
            />

            {/* 网格 */}
            {renderGrid()}

            {/* 组件 */}
            {components
              .filter((c) => c.visible)
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((component) => (
                <CanvasComponent
                  key={component.id}
                  component={component}
                  isSelected={selectedIds.includes(component.id)}
                />
              ))}

            {/* 选择框 */}
            {selectedIds.length > 0 && <SelectionBox />}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Canvas
