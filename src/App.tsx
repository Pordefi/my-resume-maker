import { useEffect, useState } from 'react'
import Toolbar from './components/Toolbar/Toolbar'
import ComponentLibrary from './components/ComponentLibrary/ComponentLibrary'
import Canvas from './components/Canvas/Canvas'
import PropertyPanel from './components/PropertyPanel/PropertyPanel'
import PageManager from './components/PageManager/PageManager'
import { useCanvasStore } from './store/canvasStore'
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function App() {
  const { components, loadTemplate } = useCanvasStore()
  const [showLeftPanel, setShowLeftPanel] = useState(true)
  const [showRightPanel, setShowRightPanel] = useState(true)

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
      loadTemplate(saved)
    }
  }, [loadTemplate])

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toolbar />
      <PageManager />
      <div className="flex-1 flex overflow-hidden relative">
        {/* 左侧面板 */}
        <div
          className={`transition-all duration-300 ${
            showLeftPanel ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <ComponentLibrary />
        </div>

        {/* 左侧折叠按钮 */}
        <button
          onClick={() => setShowLeftPanel(!showLeftPanel)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-r-lg p-2 hover:bg-gray-50 shadow-md"
          style={{ left: showLeftPanel ? '256px' : '0' }}
          title={showLeftPanel ? '隐藏组件库' : '显示组件库'}
        >
          {showLeftPanel ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {/* 画布 */}
        <Canvas />

        {/* 右侧折叠按钮 */}
        <button
          onClick={() => setShowRightPanel(!showRightPanel)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-l-lg p-2 hover:bg-gray-50 shadow-md"
          style={{ right: showRightPanel ? '320px' : '0' }}
          title={showRightPanel ? '隐藏属性面板' : '显示属性面板'}
        >
          {showRightPanel ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        {/* 右侧面板 */}
        <div
          className={`transition-all duration-300 ${
            showRightPanel ? 'w-80' : 'w-0'
          } overflow-hidden`}
        >
          <PropertyPanel />
        </div>
      </div>
    </div>
  )
}

export default App
