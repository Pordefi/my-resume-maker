import { useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useCanvasStore.getState()
      const isModKey = e.ctrlKey || e.metaKey

      if (isModKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        store.undo()
      } else if (isModKey && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        store.redo()
      } else if (isModKey && e.key === 'c') {
        e.preventDefault()
        store.copy()
      } else if (isModKey && e.key === 'v') {
        e.preventDefault()
        store.paste()
      } else if (isModKey && e.key === 'x') {
        e.preventDefault()
        store.cut()
      } else if (isModKey && e.key === 'a') {
        e.preventDefault()
        store.selectAll()
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          store.deleteSelectedComponents()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
