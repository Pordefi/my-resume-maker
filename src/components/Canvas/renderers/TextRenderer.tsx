import { Text, Group } from 'react-konva'
import { useRef, useState } from 'react'
import { TextComponent } from '@/types/canvas'
import { useCanvasStore } from '@/store/canvasStore'

interface Props {
  component: TextComponent
}

const TextRenderer = ({ component }: Props) => {
  const textRef = useRef<any>(null)
  const [, setIsEditing] = useState(false)
  const { updateComponent } = useCanvasStore()

  const handleDblClick = () => {
    setIsEditing(true)
    
    // 创建临时输入框
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

    textarea.value = component.text
    textarea.style.position = 'absolute'
    textarea.style.top = areaPosition.y + 'px'
    textarea.style.left = areaPosition.x + 'px'
    textarea.style.width = component.width + 'px'
    textarea.style.height = component.height + 'px'
    textarea.style.fontSize = component.fontSize + 'px'
    textarea.style.fontFamily = component.fontFamily
    textarea.style.color = component.color
    textarea.style.textAlign = component.textAlign
    textarea.style.border = '2px solid #0ea5e9'
    textarea.style.padding = '0'
    textarea.style.margin = '0'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'white'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.lineHeight = component.lineHeight.toString()
    textarea.style.fontWeight = component.fontWeight
    textarea.style.fontStyle = component.fontStyle
    textarea.style.zIndex = '1000'

    textarea.focus()
    textarea.select()

    const removeTextarea = () => {
      textarea.parentNode?.removeChild(textarea)
      setIsEditing(false)
    }

    textarea.addEventListener('blur', () => {
      updateComponent(component.id, { text: textarea.value })
      removeTextarea()
    })

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        removeTextarea()
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        updateComponent(component.id, { text: textarea.value })
        removeTextarea()
      }
    })
  }

  return (
    <Group>
      <Text
        ref={textRef}
        text={component.text}
        fontSize={component.fontSize}
        fontFamily={component.fontFamily}
        fontStyle={`${component.fontStyle} ${component.fontWeight}`}
        fill={component.color}
        align={component.textAlign}
        width={component.width}
        height={component.height}
        lineHeight={component.lineHeight}
        letterSpacing={component.letterSpacing}
        wrap="word"
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
      />
    </Group>
  )
}

export default TextRenderer
