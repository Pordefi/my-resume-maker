import { Group, Transformer } from 'react-konva'
import { useRef, useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
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

    node.scaleX(1)
    node.scaleY(1)

    updateComponent(component.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  const handleClick = (e: any) => {
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
