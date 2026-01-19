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
} from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import { exportToPDF, exportToImage } from '@/utils/exportPDF'
import { exportToJSON, importFromJSON } from '@/utils/storage'
import { useRef } from 'react'

const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
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
  } = useCanvasStore()

  const handleExportPDF = async () => {
    const canvas = document.querySelector('.konvajs-content') as HTMLElement
    if (canvas) {
      try {
        await exportToPDF(canvas)
      } catch (error) {
        alert('导出PDF失败')
      }
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
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-2 flex-wrap">
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
    </div>
  )
}

export default Toolbar
