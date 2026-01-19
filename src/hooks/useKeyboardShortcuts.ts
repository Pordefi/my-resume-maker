import { useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useCanvasStore.getState()
      const isModKey = e.ctrlKey || e.metaKey
      const target = e.target as HTMLElement
      const isEditingText = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

      // 撤销/重做 - 全局生效
      if (isModKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        store.undo()
      } else if (isModKey && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        store.redo()
      } 
      // Cmd+D - 复制并粘贴组件（仅在非文本编辑时）
      else if (isModKey && e.key === 'd') {
        if (!isEditingText) {
          e.preventDefault()
          store.copy()
          store.paste()
        }
      }
      // Cmd+A - 全选（仅在非文本编辑时选择所有组件）
      else if (isModKey && e.key === 'a') {
        if (!isEditingText) {
          e.preventDefault()
          store.selectAll()
        }
        // 在文本编辑时，允许默认的全选行为
      } 
      // Delete/Backspace - 删除组件（仅在非文本编辑时）
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (!isEditingText) {
          e.preventDefault()
          store.deleteSelectedComponents()
        }
      }
      // Cmd+C/V/X 不再拦截，完全用于文本操作
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
