import { Rect, Circle, Ellipse, Text, Group } from 'react-konva'
import { useRef, useState, useEffect } from 'react'
import { ShapeComponent, ShapeType } from '@/types/canvas'
import { useCanvasStore } from '@/store/canvasStore'

interface Props {
  component: ShapeComponent
}

const ShapeRenderer = ({ component }: Props) => {
  const textRef = useRef<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { updateComponent, selectedIds } = useCanvasStore()
  const isSelected = selectedIds.includes(component.id)

  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false)
    }
  }, [isSelected, isEditing])

  const handleDblClick = () => {
    if (!isSelected || !component.text) return
    
    setIsEditing(true)
    
    const textNode = textRef.current
    if (!textNode) return

    const stage = textNode.getStage()
    const stageBox = stage.container().getBoundingClientRect()
    const areaPosition = {
      x: stageBox.left + textNode.getAbsolutePosition().x,
      y: stageBox.top + textNode.getAbsolutePosition().y,
    }

    const textarea = document.createElement('textarea')
    document.body.appendChild(textarea)

    textarea.value = component.text || ''
    textarea.style.position = 'absolute'
    textarea.style.top = areaPosition.y + 'px'
    textarea.style.left = areaPosition.x + 'px'
    textarea.style.width = component.width + 'px'
    textarea.style.minHeight = component.height + 'px'
    textarea.style.fontSize = (component.fontSize || 16) + 'px'
    textarea.style.fontFamily = component.fontFamily || 'Arial, sans-serif'
    textarea.style.color = component.textColor || '#000000'
    textarea.style.textAlign = component.textAlign || 'center'
    textarea.style.border = '2px solid #0ea5e9'
    textarea.style.borderRadius = '4px'
    textarea.style.padding = '4px'
    textarea.style.margin = '0'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'white'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.fontWeight = component.fontWeight || 'normal'
    textarea.style.zIndex = '10000'
    textarea.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      textarea.style.height = textarea.scrollHeight + 'px'
    }
    
    textarea.addEventListener('input', adjustHeight)
    adjustHeight()

    textarea.focus()
    textarea.select()

    const removeTextarea = () => {
      textarea.removeEventListener('input', adjustHeight)
      textarea.parentNode?.removeChild(textarea)
      setIsEditing(false)
    }

    textarea.addEventListener('blur', () => {
      updateComponent(component.id, { text: textarea.value })
      removeTextarea()
    })

    textarea.addEventListener('keydown', (e) => {
      const isModKey = e.ctrlKey || e.metaKey
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.stopPropagation()
      }
      
      if (isModKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'd')) {
        e.stopPropagation()
      }
      
      if (e.key === 'Escape') {
        removeTextarea()
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        updateComponent(component.id, { text: textarea.value })
        removeTextarea()
      }
    })
  }

  const commonProps = {
    fill: component.fill,
    stroke: component.stroke,
    strokeWidth: component.strokeWidth,
    opacity: component.opacity,
  }

  const renderShape = () => {
    switch (component.shapeType) {
      case ShapeType.RECTANGLE:
        return (
          <Rect
            {...commonProps}
            width={component.width}
            height={component.height}
            cornerRadius={component.borderRadius}
          />
        )

      case ShapeType.CIRCLE:
        return (
          <Circle
            {...commonProps}
            radius={Math.min(component.width, component.height) / 2}
            x={component.width / 2}
            y={component.height / 2}
          />
        )

      case ShapeType.ELLIPSE:
        return (
          <Ellipse
            {...commonProps}
            radiusX={component.width / 2}
            radiusY={component.height / 2}
            x={component.width / 2}
            y={component.height / 2}
          />
        )

      default:
        return null
    }
  }

  return (
    <Group>
      {renderShape()}
      {component.text && (
        <Text
          ref={textRef}
          text={component.text}
          fontSize={component.fontSize || 16}
          fontFamily={component.fontFamily || 'Arial, sans-serif'}
          fontStyle={component.fontWeight || 'normal'}
          fill={component.textColor || '#000000'}
          align={component.textAlign || 'center'}
          verticalAlign="middle"
          width={component.width}
          height={component.height}
          onDblClick={handleDblClick}
          onDblTap={handleDblClick}
        />
      )}
    </Group>
  )
}

export default ShapeRenderer
