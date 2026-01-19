import { useEffect } from 'react'
import Toolbar from './components/Toolbar/Toolbar'
import ComponentLibrary from './components/ComponentLibrary/ComponentLibrary'
import Canvas from './components/Canvas/Canvas'
import PropertyPanel from './components/PropertyPanel/PropertyPanel'
import { useCanvasStore } from './store/canvasStore'
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage'

function App() {
  const { components, loadTemplate } = useCanvasStore()

  // 自动保存
  useEffect(() => {
    const timer = setInterval(() => {
      saveToLocalStorage(components)
    }, 5000)

    return () => clearInterval(timer)
  }, [components])

  // 加载自动保存的数据
  useEffect(() => {
    const saved = loadFromLocalStorage()
    if (saved && saved.length > 0) {
      const shouldLoad = confirm('检测到自动保存的数据，是否恢复？')
      if (shouldLoad) {
        loadTemplate(saved)
      }
    }
  }, [loadTemplate])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <ComponentLibrary />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  )
}

export default App
