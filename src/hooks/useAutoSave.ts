import { useEffect } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { saveToLocalStorage } from '@/utils/storage'

export const useAutoSave = (interval = 5000) => {
  const components = useCanvasStore((state) => state.components)

  useEffect(() => {
    const timer = setInterval(() => {
      if (components.length > 0) {
        saveToLocalStorage(components)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [components, interval])
}
