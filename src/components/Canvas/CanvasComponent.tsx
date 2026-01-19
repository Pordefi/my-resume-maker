import { Group, Transformer } from 'react-konva'
import { useRef, useEffect } from 'react'
import { useCanvasStore, getPendingComponent, getPendingTemplate } from '@/store/canvasStore'
import { CanvasComponent as CanvasComponentType, ComponentType } from '@/types/canvas'
import TextRenderer from './renderers/TextRenderer'
import ImageRenderer from './renderers/ImageRenderer'
import ShapeRenderer from './renderers/ShapeRenderer'
import LineRenderer from './renderers/LineRenderer'
import IconRenderer from './renderers/IconRenderer'

interface Props {
  component: CanvasComponentType
  isSelected: boolean
}

const CanvasComponent = ({ component, isSelected }: Props) => {
  const groupRef = useRef<any>(null)
  const transformerRef = useRef<any>(null)
  const { updateComponent, selectComponent } = useCanvasStore()
  const dragStartPosRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const handleDragStart = (e: any) => {
    dragStartPosRef.current = {
      x: e.target.x(),
      y: e.target.y(),
    }
  }

  const handleDragMove = (e: any) => {
    // 如果组件属于某个组，同步移动组内其他组件
    if (component.groupId && dragStartPosRef.current) {
      const newX = e.target.x()
      const newY = e.target.y()
      const deltaX = newX - dragStartPosRef.current.x
      const deltaY = newY - dragStartPosRef.current.y

      const store = useCanvasStore.getState()
      const group = store.groups.find((g) => g.id === component.groupId)
      
      if (group) {
        // 临时更新组内其他组件的位置（不保存到历史）
        group.componentIds.forEach((compId) => {
          if (compId !== component.id) {
            const comp = store.components.find((c) => c.id === compId)
            if (comp) {
              store.updateComponent(compId, {
                x: comp.x + deltaX,
                y: comp.y + deltaY,
              })
            }
          }
        })

        // 更新拖动起始位置
        dragStartPosRef.current = { x: newX, y: newY }
      }
    }
  }

  const handleDragEnd = (e: any) => {
    const newX = e.target.x()
    const newY = e.target.y()

    // 如果组件属于某个组，最终位置已经在 handleDragMove 中更新了
    if (component.groupId) {
      // 只需要更新当前组件的最终位置
      updateComponent(component.id, {
        x: newX,
        y: newY,
      })
    } else {
      // 普通组件直接更新
      updateComponent(component.id, {
        x: newX,
        y: newY,
      })
    }

    dragStartPosRef.current = null
  }

  const handleTransformEnd = () => {
    const node = groupRef.current
    if (!node) return

    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // 获取当前实际的宽高（缩放前的）
    const currentWidth = node.width()
    const currentHeight = node.height()

    // 重置scale
    node.scaleX(1)
    node.scaleY(1)

    // 计算新的宽高（基于当前实际尺寸）
    let newWidth = Math.max(5, currentWidth * scaleX)
    let newHeight = Math.max(5, currentHeight * scaleY)

    // 对于文本组件，根据新宽度重新计算高度
    if (component.type === ComponentType.TEXT) {
      // 使用更精确的计算方式
      // 估算每行平均字符数（考虑中英文混合）
      const avgCharWidth = component.fontSize * 0.7 // 调整为0.7以获得更准确的估算
      const charsPerLine = Math.max(1, Math.floor(newWidth / avgCharWidth))
      
      // 计算文本总字符数（考虑换行符）
      const lines = component.text.split('\n')
      let totalLines = 0
      
      for (const line of lines) {
        if (line.length === 0) {
          totalLines += 1 // 空行也占一行
        } else {
          // 计算这一行的字符宽度
          let lineWidth = 0
          for (const char of line) {
            if (/[\u4e00-\u9fa5]/.test(char)) {
              lineWidth += 1 // 中文字符
            } else {
              lineWidth += 0.6 // 英文字符
            }
          }
          // 计算这一行需要多少行来显示
          totalLines += Math.ceil(lineWidth / charsPerLine)
        }
      }
      
      // 根据总行数计算高度，添加适当的padding
      newHeight = Math.max(totalLines * component.fontSize * component.lineHeight + 20, component.fontSize * 2)
    }

    // 对于线条组件，需要同时更新points
    if (component.type === ComponentType.LINE) {
      // 根据新的宽高重新计算points
      let newPoints: number[]
      
      // 判断是水平线还是垂直线
      const isHorizontal = newWidth > newHeight
      
      if (isHorizontal) {
        // 水平线：更新X坐标
        newPoints = [0, 0, newWidth, 0]
      } else {
        // 垂直线：更新Y坐标
        newPoints = [0, 0, 0, newHeight]
      }
      
      updateComponent(component.id, {
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        rotation: node.rotation(),
        points: newPoints,
      })
    } else {
      updateComponent(component.id, {
        x: node.x(),
        y: node.y(),
        width: newWidth,
        height: newHeight,
        rotation: node.rotation(),
      })
    }
  }

  const handleClick = (e: any) => {
    // 如果有待放置的组件或模板，不拦截点击事件，让它冒泡到Stage
    if (getPendingComponent() || getPendingTemplate()) {
      return
    }
    
    e.cancelBubble = true
    selectComponent(component.id, e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey)
  }

  const renderComponent = () => {
    switch (component.type) {
      case ComponentType.TEXT:
        return <TextRenderer component={component} />
      case ComponentType.IMAGE:
        return <ImageRenderer component={component} />
      case ComponentType.SHAPE:
        return <ShapeRenderer component={component} />
      case ComponentType.LINE:
        return <LineRenderer component={component} />
      case ComponentType.ICON:
        return <IconRenderer component={component} />
      default:
        return null
    }
  }

  // 阴影配置
  const shadowConfig = component.shadow?.enabled
    ? {
        shadowColor: component.shadow.color,
        shadowBlur: component.shadow.blur,
        shadowOffsetX: component.shadow.offsetX,
        shadowOffsetY: component.shadow.offsetY,
        shadowOpacity: component.shadow.opacity,
      }
    : {}

  return (
    <>
      <Group
        ref={groupRef}
        x={component.x}
        y={component.y}
        width={component.width}
        height={component.height}
        rotation={component.rotation}
        draggable={!component.locked}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={handleClick}
        onTap={handleClick}
        {...shadowConfig}
      >
        {renderComponent()}
      </Group>

      {isSelected && !component.locked && (
        <Transformer
          ref={transformerRef}
          rotateEnabled={true}
          keepRatio={false}
          enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-right', 'middle-left', 'bottom-left', 'bottom-center', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => {
            // 确保最小尺寸
            if (newBox.width < 5) {
              newBox.width = 5
            }
            if (newBox.height < 5) {
              newBox.height = 5
            }
            return newBox
          }}
          borderStroke="#0ea5e9"
          borderStrokeWidth={2}
          anchorStroke="#0ea5e9"
          anchorFill="#ffffff"
          anchorSize={8}
          anchorCornerRadius={4}
        />
      )}
    </>
  )
}

export default CanvasComponent
