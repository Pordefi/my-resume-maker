import { useRef, useEffect } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import { useCanvasStore } from '@/store/canvasStore'
import { CANVAS_CONFIGS } from '@/types/canvas'
import CanvasComponent from './CanvasComponent'
import SelectionBox from './SelectionBox'

const Canvas = () => {
  const stageRef = useRef<any>(null)
  const [selectionRect, setSelectionRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null)

  const {
    components,
    selectedIds,
    zoom,
    showGrid,
    clearSelection,
    selectComponent,
    canvasSize,
    canvasWidth,
    canvasHeight,
    canvasBackgroundColor,
  } = useCanvasStore()

  const gridSize = CANVAS_CONFIGS[canvasSize].gridSize

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

    // 垂直线
    for (let i = 0; i <= canvasWidth; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, canvasHeight]}
          stroke="#e5e7eb"
          strokeWidth={1}
          listening={false}
        />
      )
    }

    // 水平线
    for (let i = 0; i <= canvasHeight; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, canvasWidth, i]}
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
    // 点击 Stage 本身或背景 Rect
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'background-rect'
    if (clickedOnEmpty) {
      clearSelection()
    }
  }

  // 鼠标按下开始圈选
  const handleMouseDown = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'background-rect'
    if (!clickedOnEmpty) return

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    
    if (pointerPosition) {
      setIsSelecting(true)
      selectionStartRef.current = {
        x: pointerPosition.x / zoom,
        y: pointerPosition.y / zoom,
      }
      setSelectionRect({
        x: pointerPosition.x / zoom,
        y: pointerPosition.y / zoom,
        width: 0,
        height: 0,
      })
    }
  }

  // 鼠标移动更新圈选框
  const handleMouseMove = (e: any) => {
    if (!isSelecting || !selectionStartRef.current) return

    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    
    if (pointerPosition) {
      const x = pointerPosition.x / zoom
      const y = pointerPosition.y / zoom
      const startX = selectionStartRef.current.x
      const startY = selectionStartRef.current.y

      setSelectionRect({
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        width: Math.abs(x - startX),
        height: Math.abs(y - startY),
      })
    }
  }

  // 鼠标松开完成圈选
  const handleMouseUp = () => {
    if (!isSelecting || !selectionRect) {
      setIsSelecting(false)
      setSelectionRect(null)
      selectionStartRef.current = null
      return
    }

    // 查找在圈选框内的组件
    const selectedComponents = components.filter((component) => {
      const compX = component.x
      const compY = component.y
      const compRight = component.x + component.width
      const compBottom = component.y + component.height

      const rectX = selectionRect.x
      const rectY = selectionRect.y
      const rectRight = selectionRect.x + selectionRect.width
      const rectBottom = selectionRect.y + selectionRect.height

      // 检查组件是否与圈选框相交
      return (
        compX < rectRight &&
        compRight > rectX &&
        compY < rectBottom &&
        compBottom > rectY
      )
    })

    // 选中这些组件
    if (selectedComponents.length > 0) {
      const store = useCanvasStore.getState()
      store.clearSelection()
      selectedComponents.forEach((comp) => {
        store.selectComponent(comp.id, true)
      })
    }

    setIsSelecting(false)
    setSelectionRect(null)
    selectionStartRef.current = null
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-100 p-8">
      <div
        className="mx-auto shadow-2xl"
        style={{
          width: canvasWidth * zoom,
          height: canvasHeight * zoom,
        }}
      >
        <Stage
          ref={stageRef}
          width={canvasWidth}
          height={canvasHeight}
          scaleX={zoom}
          scaleY={zoom}
          onClick={handleStageClick}
          onTap={handleStageClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        >
          <Layer>
            {/* 背景 */}
            <Rect
              id="background-rect"
              x={0}
              y={0}
              width={canvasWidth}
              height={canvasHeight}
              fill={canvasBackgroundColor}
              onClick={handleStageClick}
              onTap={handleStageClick}
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

            {/* 圈选框 */}
            {isSelecting && selectionRect && (
              <Rect
                x={selectionRect.x}
                y={selectionRect.y}
                width={selectionRect.width}
                height={selectionRect.height}
                stroke="#0ea5e9"
                strokeWidth={2}
                dash={[5, 5]}
                fill="rgba(14, 165, 233, 0.1)"
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

export default Canvas
