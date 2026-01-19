import { useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useCanvasStore.getState()
      const isModKey = e.ctrlKey || e.metaKey
      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      if (isModKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        store.undo()
      } else if (isModKey && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        store.redo()
      } else if (isModKey && e.key === 'c') {
        // 在文本编辑时允许默认的复制行为
        if (!isEditingText) {
          e.preventDefault()
          store.copy()
        }
      } else if (isModKey && e.key === 'v') {
        // 在文本编辑时允许默认的粘贴行为
        if (!isEditingText) {
          e.preventDefault()
          store.paste()
        }
      } else if (isModKey && e.key === 'x') {
        // 在文本编辑时允许默认的剪切行为
        if (!isEditingText) {
          e.preventDefault()
          store.cut()
        }
      } else if (isModKey && e.key === 'a') {
        // 在文本编辑时允许默认的全选行为
        if (!isEditingText) {
          e.preventDefault()
          store.selectAll()
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isEditingText) {
          e.preventDefault()
          store.deleteSelectedComponents()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
