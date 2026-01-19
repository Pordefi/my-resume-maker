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

  useEffect(() => {
    if (isSelected && transformerRef.current && groupRef.current) {
      transformerRef.current.nodes([groupRef.current])
      transformerRef.current.getLayer().batchDraw()
    }
  }, [isSelected])

  const handleDragEnd = (e: any) => {
    updateComponent(component.id, {
      x: e.target.x(),
      y: e.target.y(),
    })
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
