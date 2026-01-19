import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Rect, Line, Group } from 'react-konva'
import { useCanvasStore, getPendingComponent, setPendingComponent, getPendingTemplate, setPendingTemplate, setStageRef } from '@/store/canvasStore'
import { CANVAS_CONFIGS, ShapeType } from '@/types/canvas'
import CanvasComponent from './CanvasComponent'
import SelectionBox from './SelectionBox'
import Ruler from './Ruler'
import { createShapeComponent } from '@/utils/componentFactory'

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
  const [pendingComponentPreview, setPendingComponentPreview] = useState<{ x: number; y: number } | null>(null)

  const {
    components,
    selectedIds,
    zoom,
    showGrid,
    showRuler,
    clearSelection,
    addComponent,
    canvasSize,
    canvasWidth,
    canvasHeight,
    canvasBackgroundColor,
    guides,
    showGuides,
  } = useCanvasStore()

  const gridSize = CANVAS_CONFIGS[canvasSize].gridSize

  // 将stageRef保存到store中，供导出功能使用
  useEffect(() => {
    if (stageRef.current) {
      setStageRef(stageRef)
    }
  }, [stageRef.current])

  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useCanvasStore.getState()
      
      // ESC: 取消待放置组件或模板
      if (e.key === 'Escape') {
        if (getPendingComponent() || getPendingTemplate()) {
          e.preventDefault()
          setPendingComponent(null)
          setPendingTemplate(null)
          setPendingComponentPreview(null)
          return
        }
      }
      
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

  // 点击空白处取消选择或放置待添加组件/模板
  const handleStageClick = (e: any) => {
    const pendingComp = getPendingComponent()
    const pendingTemplate = getPendingTemplate()
    
    // 如果有待放置的组件或模板，不管点击什么都要放置
    if (pendingComp || pendingTemplate) {
      const stage = e.target.getStage()
      const pointerPosition = stage.getPointerPosition()
      
      if (!pointerPosition) return
      
      // 如果有待放置的单个组件
      if (pendingComp) {
        const newComp = {
          ...pendingComp,
          id: `${pendingComp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: pointerPosition.x / zoom,
          y: pointerPosition.y / zoom,
        }
        addComponent(newComp)
        setPendingComponent(null)
        setPendingComponentPreview(null)
        e.cancelBubble = true
        return
      }
      
      // 如果有待放置的模板（多个组件）
      if (pendingTemplate && pendingTemplate.length > 0) {
        const clickX = pointerPosition.x / zoom
        const clickY = pointerPosition.y / zoom
        
        // 计算模板的原始边界
        const minX = Math.min(...pendingTemplate.map(c => c.x))
        const minY = Math.min(...pendingTemplate.map(c => c.y))
        const maxX = Math.max(...pendingTemplate.map(c => c.x + (c.width || 0)))
        const maxY = Math.max(...pendingTemplate.map(c => c.y + (c.height || 0)))
        
        // 计算偏移量（让模板中心对齐到点击位置）
        const templateCenterX = (minX + maxX) / 2
        const templateCenterY = (minY + maxY) / 2
        const offsetX = clickX - templateCenterX
        const offsetY = clickY - templateCenterY
        
        // 调整所有组件位置并生成新ID
        const adjustedComponents = pendingTemplate.map(comp => ({
          ...comp,
          id: `${comp.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          x: comp.x + offsetX,
          y: comp.y + offsetY,
        }))
        
        // 计算调整后的边界
        const adjMinX = Math.min(...adjustedComponents.map(c => c.x))
        const adjMinY = Math.min(...adjustedComponents.map(c => c.y))
        const adjMaxX = Math.max(...adjustedComponents.map(c => c.x + (c.width || 0)))
        const adjMaxY = Math.max(...adjustedComponents.map(c => c.y + (c.height || 0)))
        
        // 添加隐形背景边框
        const padding = 20
        const background = createShapeComponent(
          adjMinX - padding,
          adjMinY - padding,
          ShapeType.RECTANGLE
        )
        background.width = (adjMaxX - adjMinX) + (padding * 2)
        background.height = (adjMaxY - adjMinY) + (padding * 2)
        background.fill = '#ffffff'
        background.opacity = 0.01
        background.stroke = 'transparent'
        background.strokeWidth = 0
        background.id = `bg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        background.zIndex = -1
        
        const componentsWithBg = [background, ...adjustedComponents]
        
        // 添加所有组件（不再自动成组）
        componentsWithBg.forEach((comp) => addComponent(comp))
        
        setPendingTemplate(null)
        setPendingComponentPreview(null)
        e.cancelBubble = true
        return
      }
    }
    
    // 没有待放置组件时，点击空白处取消选择
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === 'background-rect'
    if (clickedOnEmpty) {
      clearSelection()
    }
  }

  // 鼠标按下开始圈选
  const handleMouseDown = (e: any) => {
    // 如果有待放置组件或模板，不启动圈选
    if (getPendingComponent() || getPendingTemplate()) return
    
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

  // 鼠标移动更新圈选框或待放置组件/模板预览
  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage()
    const pointerPosition = stage.getPointerPosition()
    
    if (!pointerPosition) return
    
    // 更新待放置组件或模板的预览位置
    if (getPendingComponent() || getPendingTemplate()) {
      setPendingComponentPreview({
        x: pointerPosition.x / zoom,
        y: pointerPosition.y / zoom,
      })
      return
    }
    
    // 更新圈选框
    if (!isSelecting || !selectionStartRef.current) return

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
      <div className="mx-auto relative" style={{ 
        width: canvasWidth * zoom + (showRuler ? 20 : 0),
        height: canvasHeight * zoom + (showRuler ? 20 : 0),
        cursor: (getPendingComponent() || getPendingTemplate()) ? 'crosshair' : 'default',
      }}>
        {/* 标尺 */}
        {showRuler && (
          <>
            {/* 左上角方块 */}
            <div className="absolute top-0 left-0 w-5 h-5 bg-gray-300 border-r border-b border-gray-400 z-10" />
            {/* 水平标尺 */}
            <Ruler type="horizontal" zoom={zoom} />
            {/* 垂直标尺 */}
            <Ruler type="vertical" zoom={zoom} />
          </>
        )}
        
        {/* 画布 */}
        <div
          className="shadow-2xl"
          style={{
            width: canvasWidth * zoom,
            height: canvasHeight * zoom,
            marginLeft: showRuler ? 20 : 0,
            marginTop: showRuler ? 20 : 0,
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
              onClick={(e) => {
                // 优先处理待放置组件/模板
                if (getPendingComponent() || getPendingTemplate()) {
                  handleStageClick(e)
                } else {
                  handleStageClick(e)
                }
              }}
              onTap={handleStageClick}
            />

            {/* 网格 */}
            {renderGrid()}

            {/* 辅助线 */}
            {showGuides &&
              guides
                .filter((g) => g.visible)
                .map((guide) => (
                  <Line
                    key={guide.id}
                    points={
                      guide.type === 'vertical'
                        ? [guide.position, 0, guide.position, canvasHeight]
                        : [0, guide.position, canvasWidth, guide.position]
                    }
                    stroke={guide.color}
                    strokeWidth={1}
                    dash={[10, 5]}
                    listening={false}
                    opacity={0.6}
                  />
                ))}

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

            {/* 待放置组件预览 */}
            {pendingComponentPreview && getPendingComponent() && (
              <Group opacity={0.6} listening={false}>
                <CanvasComponent
                  component={{
                    ...getPendingComponent()!,
                    x: pendingComponentPreview.x,
                    y: pendingComponentPreview.y,
                  }}
                  isSelected={false}
                />
              </Group>
            )}
            
            {/* 待放置模板预览 */}
            {pendingComponentPreview && getPendingTemplate() && (
              <Group opacity={0.6} listening={false}>
                {getPendingTemplate()!.map((comp, index) => {
                  const template = getPendingTemplate()!
                  const minX = Math.min(...template.map(c => c.x))
                  const minY = Math.min(...template.map(c => c.y))
                  const maxX = Math.max(...template.map(c => c.x + (c.width || 0)))
                  const maxY = Math.max(...template.map(c => c.y + (c.height || 0)))
                  const centerX = (minX + maxX) / 2
                  const centerY = (minY + maxY) / 2
                  const offsetX = pendingComponentPreview.x - centerX
                  const offsetY = pendingComponentPreview.y - centerY
                  
                  return (
                    <CanvasComponent
                      key={`preview-${index}`}
                      component={{
                        ...comp,
                        x: comp.x + offsetX,
                        y: comp.y + offsetY,
                      }}
                      isSelected={false}
                    />
                  )
                })}
              </Group>
            )}

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
    </div>
  )
}

export default Canvas
