import { Text, Group } from 'react-konva'
import { useRef, useState, useEffect } from 'react'
import { TextComponent } from '@/types/canvas'
import { useCanvasStore } from '@/store/canvasStore'

interface Props {
  component: TextComponent
}

const TextRenderer = ({ component }: Props) => {
  const textRef = useRef<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const { updateComponent, selectedIds } = useCanvasStore()
  const isSelected = selectedIds.includes(component.id)

  // 当组件被选中且用户再次点击时，进入编辑模式
  useEffect(() => {
    if (!isSelected && isEditing) {
      setIsEditing(false)
    }
  }, [isSelected, isEditing])

  const handleDblClick = () => {
    if (!isSelected) return
    
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
    textarea.style.minHeight = component.height + 'px'
    textarea.style.fontSize = component.fontSize + 'px'
    textarea.style.fontFamily = component.fontFamily
    textarea.style.color = component.color
    textarea.style.textAlign = component.textAlign
    textarea.style.border = '2px solid #0ea5e9'
    textarea.style.borderRadius = '4px'
    textarea.style.padding = '4px'
    textarea.style.margin = '0'
    textarea.style.overflow = 'hidden'
    textarea.style.background = 'white'
    textarea.style.outline = 'none'
    textarea.style.resize = 'none'
    textarea.style.lineHeight = component.lineHeight.toString()
    textarea.style.fontWeight = component.fontWeight
    textarea.style.fontStyle = component.fontStyle
    textarea.style.zIndex = '10000'
    textarea.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'

    // 自动调整高度
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
      const newText = textarea.value
      
      // 计算新文本需要的高度
      const avgCharWidth = component.fontSize * 0.8
      const charsPerLine = Math.floor(component.width / avgCharWidth)
      
      let totalChars = 0
      for (const char of newText) {
        if (/[\u4e00-\u9fa5]/.test(char)) {
          totalChars += 1
        } else if (char === '\n') {
          totalChars += charsPerLine
        } else {
          totalChars += 0.6
        }
      }
      
      const actualLines = charsPerLine > 0 ? Math.ceil(totalChars / charsPerLine) : 1
      const newHeight = Math.max(actualLines * component.fontSize * component.lineHeight + 20, component.fontSize * 2)
      
      updateComponent(component.id, { 
        text: newText,
        height: newHeight
      })
      removeTextarea()
    })

    textarea.addEventListener('keydown', (e) => {
      const isModKey = e.ctrlKey || e.metaKey
      
      // 阻止Delete和Backspace事件冒泡到全局，避免删除组件
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.stopPropagation()
      }
      
      // 阻止Cmd+C/V/X/A/D事件冒泡，让浏览器处理文本操作
      if (isModKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'd')) {
        e.stopPropagation()
      }
      
      if (e.key === 'Escape') {
        removeTextarea()
      }
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        const newText = textarea.value
        
        // 计算新文本需要的高度
        const avgCharWidth = component.fontSize * 0.8
        const charsPerLine = Math.floor(component.width / avgCharWidth)
        
        let totalChars = 0
        for (const char of newText) {
          if (/[\u4e00-\u9fa5]/.test(char)) {
            totalChars += 1
          } else if (char === '\n') {
            totalChars += charsPerLine
          } else {
            totalChars += 0.6
          }
        }
        
        const actualLines = charsPerLine > 0 ? Math.ceil(totalChars / charsPerLine) : 1
        const newHeight = Math.max(actualLines * component.fontSize * component.lineHeight + 20, component.fontSize * 2)
        
        updateComponent(component.id, { 
          text: newText,
          height: newHeight
        })
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
        lineHeight={component.lineHeight}
        letterSpacing={component.letterSpacing}
        wrap="word"
        ellipsis={false}
        onDblClick={handleDblClick}
        onDblTap={handleDblClick}
      />
    </Group>
  )
}

export default TextRenderer
