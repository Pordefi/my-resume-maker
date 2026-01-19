import {
  Undo,
  Redo,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  Grid,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  Maximize,
  FileText,
} from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import { exportToPDF, exportToImage, exportMultiPageToPDF } from '@/utils/exportPDF'
import { exportToJSON, importFromJSON } from '@/utils/storage'
import { useRef, useState } from 'react'
import { CanvasSize, Page } from '@/types/canvas'

const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCanvasSettings, setShowCanvasSettings] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedExportPages, setSelectedExportPages] = useState<string[]>([])
  const {
    undo,
    redo,
    copy,
    paste,
    deleteSelectedComponents,
    clearCanvas,
    zoom,
    setZoom,
    toggleGrid,
    showGrid,
    selectedIds,
    alignComponents,
    distributeComponents,
    components,
    loadTemplate,
    canvasSize,
    setCanvasSize,
    canvasBackgroundColor,
    setCanvasBackgroundColor,
  } = useCanvasStore()

  const handleExportPDF = async () => {
    const { pages, currentPageId } = useCanvasStore.getState()
    
    if (pages.length === 1) {
      // 单页面直接导出
      const canvas = document.querySelector('.konvajs-content') as HTMLElement
      if (canvas) {
        try {
          await exportToPDF(canvas)
        } catch (error) {
          alert('导出PDF失败')
        }
      }
    } else {
      // 多页面显示选择对话框
      setShowExportDialog(true)
    }
  }

  const handleMultiPageExport = async (selectedPageIds: string[]) => {
    if (selectedPageIds.length === 0) {
      alert('请至少选择一个页面')
      return
    }

    try {
      const { pages, switchPage, currentPageId: originalPageId } = useCanvasStore.getState()
      
      // 临时渲染函数
      const renderPage = async (page: Page): Promise<HTMLElement> => {
        // 切换到目标页面
        switchPage(page.id)
        
        // 等待渲染
        await new Promise((resolve) => setTimeout(resolve, 100))
        
        const canvas = document.querySelector('.konvajs-content') as HTMLElement
        if (!canvas) throw new Error('无法找到画布元素')
        
        return canvas
      }

      await exportMultiPageToPDF(pages, selectedPageIds, renderPage)
      
      // 恢复原页面
      switchPage(originalPageId)
      
      setShowExportDialog(false)
    } catch (error) {
      alert('导出PDF失败: ' + (error as Error).message)
    }
  }

  const handleExportImage = async () => {
    const canvas = document.querySelector('.konvajs-content') as HTMLElement
    if (canvas) {
      try {
        await exportToImage(canvas)
      } catch (error) {
        alert('导出图片失败')
      }
    }
  }

  const handleExportJSON = () => {
    exportToJSON(components)
  }

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const data = await importFromJSON(file)
      loadTemplate(data)
    } catch (error) {
      alert('导入失败: ' + (error as Error).message)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClearCanvas = () => {
    if (confirm('确定要清空画布吗？此操作不可撤销。')) {
      clearCanvas()
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap relative">
      {/* 画布设置 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => setShowCanvasSettings(!showCanvasSettings)}
          className={`p-2 hover:bg-gray-100 rounded ${
            showCanvasSettings ? 'bg-blue-50 text-blue-600' : ''
          }`}
          title="画布设置"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* 画布设置面板 */}
      {showCanvasSettings && (
        <div className="absolute top-12 left-4 bg-white border rounded-lg shadow-lg p-4 z-50 w-64">
          <h3 className="text-sm font-semibold mb-3">画布设置</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">画布尺寸</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCanvasSize(CanvasSize.A4)}
                  className={`flex-1 px-3 py-2 border rounded text-sm flex items-center justify-center gap-1 ${
                    canvasSize === CanvasSize.A4
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <FileText size={14} />
                  A4
                </button>
                <button
                  onClick={() => setCanvasSize(CanvasSize.INFINITE)}
                  className={`flex-1 px-3 py-2 border rounded text-sm flex items-center justify-center gap-1 ${
                    canvasSize === CanvasSize.INFINITE
                      ? 'bg-blue-500 text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <Maximize size={14} />
                  无限
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">背景颜色</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={canvasBackgroundColor}
                  onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                  className="w-12 h-8 border rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={canvasBackgroundColor}
                  onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowCanvasSettings(false)}
            className="mt-3 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            关闭
          </button>
        </div>
      )}

      {/* 历史操作 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={undo}
          className="p-2 hover:bg-gray-100 rounded"
          title="撤销 (Ctrl+Z)"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={redo}
          className="p-2 hover:bg-gray-100 rounded"
          title="重做 (Ctrl+Shift+Z)"
        >
          <Redo size={18} />
        </button>
      </div>

      {/* 剪贴板 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={copy}
          className="p-2 hover:bg-gray-100 rounded"
          title="复制 (Ctrl+C)"
          disabled={selectedIds.length === 0}
        >
          <Copy size={18} />
        </button>
        <button
          onClick={paste}
          className="p-2 hover:bg-gray-100 rounded"
          title="粘贴 (Ctrl+V)"
        >
          <Save size={18} />
        </button>
        <button
          onClick={deleteSelectedComponents}
          className="p-2 hover:bg-gray-100 rounded text-red-600"
          title="删除 (Delete)"
          disabled={selectedIds.length === 0}
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* 对齐 */}
      {selectedIds.length >= 2 && (
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => alignComponents('left')}
            className="p-2 hover:bg-gray-100 rounded"
            title="左对齐"
          >
            <AlignLeft size={18} />
          </button>
          <button
            onClick={() => alignComponents('center')}
            className="p-2 hover:bg-gray-100 rounded"
            title="水平居中"
          >
            <AlignCenter size={18} />
          </button>
          <button
            onClick={() => alignComponents('right')}
            className="p-2 hover:bg-gray-100 rounded"
            title="右对齐"
          >
            <AlignRight size={18} />
          </button>
          <button
            onClick={() => alignComponents('middle')}
            className="p-2 hover:bg-gray-100 rounded"
            title="垂直居中"
          >
            <AlignVerticalJustifyCenter size={18} />
          </button>
        </div>
      )}

      {/* 组操作 */}
      {selectedIds.length >= 2 && (
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => {
              const { components, selectedIds, groups } = useCanvasStore.getState()
              const selectedComponents = components.filter((c) => selectedIds.includes(c.id))
              const groupIds = [...new Set(selectedComponents.map((c) => c.groupId).filter(Boolean))]
              const currentGroup = groupIds.length === 1 ? groups.find((g) => g.id === groupIds[0]) : undefined
              
              if (currentGroup) {
                ungroupComponents(currentGroup.id)
              } else {
                createGroup()
              }
            }}
            className="p-2 hover:bg-gray-100 rounded"
            title="创建组/解散组"
          >
            <Users size={18} />
          </button>
        </div>
      )}

      {/* 视图 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => setZoom(zoom - 0.1)}
          className="p-2 hover:bg-gray-100 rounded"
          title="缩小"
        >
          <ZoomOut size={18} />
        </button>
        <span className="px-2 py-2 text-sm min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(zoom + 0.1)}
          className="p-2 hover:bg-gray-100 rounded"
          title="放大"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={toggleGrid}
          className={`p-2 hover:bg-gray-100 rounded ${
            showGrid ? 'bg-blue-50 text-blue-600' : ''
          }`}
          title="显示网格"
        >
          <Grid size={18} />
        </button>
      </div>

      {/* 导入导出 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded"
          title="导入JSON"
        >
          <Upload size={18} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          className="hidden"
        />
        <button
          onClick={handleExportJSON}
          className="p-2 hover:bg-gray-100 rounded"
          title="导出JSON"
        >
          <Save size={18} />
        </button>
        <button
          onClick={handleExportPDF}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          title="导出PDF"
        >
          <Download size={18} className="inline mr-1" />
          PDF
        </button>
        <button
          onClick={handleExportImage}
          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          title="导出图片"
        >
          <Download size={18} className="inline mr-1" />
          PNG
        </button>
      </div>

      {/* 清空 */}
      <button
        onClick={handleClearCanvas}
        className="p-2 hover:bg-gray-100 rounded text-red-600"
        title="清空画布"
      >
        <Trash2 size={18} />
      </button>

      {/* 多页面导出对话框 */}
      {showExportDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">选择要导出的页面</h3>
            
            <div className="space-y-2 mb-4">
              {useCanvasStore.getState().pages.map((page) => (
                <label
                  key={page.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedExportPages.includes(page.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedExportPages([...selectedExportPages, page.id])
                      } else {
                        setSelectedExportPages(selectedExportPages.filter((id) => id !== page.id))
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{page.name}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const allPageIds = useCanvasStore.getState().pages.map((p) => p.id)
                  setSelectedExportPages(allPageIds)
                }}
                className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                全选
              </button>
              <button
                onClick={() => setSelectedExportPages([])}
                className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                清空
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowExportDialog(false)
                  setSelectedExportPages([])
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => handleMultiPageExport(selectedExportPages)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={selectedExportPages.length === 0}
              >
                导出 ({selectedExportPages.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
