import {
  Undo,
  Redo,
  Download,
  Upload,
  Save,
  Trash2,
  Copy,
  Clipboard,
  Grid,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignStartVertical,
  AlignEndVertical,
  Maximize,
  FileText,
  Ruler,
  Type,
  Image,
  Square,
  Minus,
  Circle,
  X,
  Palette,
  ArrowUpToLine,
  ArrowDownToLine,
  Group,
  Ungroup,
} from 'lucide-react'
import { useCanvasStore, setPendingComponent } from '@/store/canvasStore'
import { exportToPDF, exportToImage, exportMultiPageToPDF } from '@/utils/exportPDF'
import { exportToWord, exportMultiPageToWord } from '@/utils/exportWord'
import { importFromJSON, exportFullStateToJSON, importFullStateFromJSON } from '@/utils/storage'
import { useRef, useState } from 'react'
import { CanvasSize, Page, ShapeType } from '@/types/canvas'
import {
  createTextComponent,
  createImageComponent,
  createShapeComponent,
  createLineComponent,
} from '@/utils/componentFactory'
import { COLOR_THEMES } from '@/utils/colorThemes'

const Toolbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showCanvasSettings, setShowCanvasSettings] = useState(false)
  const [showColorThemePanel, setShowColorThemePanel] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [showWordExportDialog, setShowWordExportDialog] = useState(false)
  const [selectedExportPages, setSelectedExportPages] = useState<string[]>([])
  const [selectedWordExportPages, setSelectedWordExportPages] = useState<string[]>([])
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
    loadTemplate,
    canvasSize,
    setCanvasSize,
    canvasBackgroundColor,
    setCanvasBackgroundColor,
    createGroup,
    ungroupComponents,
    applyColorTheme,
    bringToFront,
    sendToBack,
  } = useCanvasStore()

  // 添加基础组件的函数 - 使用拖放模式
  const addText = () => {
    setPendingComponent(createTextComponent(0, 0))
  }

  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          const src = event.target?.result as string
          setPendingComponent(createImageComponent(0, 0, src))
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const addShape = (shapeType: ShapeType) => {
    setPendingComponent(createShapeComponent(0, 0, shapeType))
  }

  const addLine = () => {
    setPendingComponent(createLineComponent(0, 0, true))
  }

  const handleExportPDF = async () => {
    const { pages, showGuides: currentShowGuides } = useCanvasStore.getState()
    
    // 辅助线控制函数
    const hideGuides = () => {
      if (currentShowGuides) {
        useCanvasStore.getState().toggleShowGuides()
      }
    }
    
    const restoreGuides = () => {
      if (currentShowGuides) {
        useCanvasStore.getState().toggleShowGuides()
      }
    }
    
    if (pages.length === 1) {
      // 单页面直接导出
      const canvas = document.querySelector('.konvajs-content') as HTMLElement
      if (canvas) {
        try {
          await exportToPDF(canvas, 'resume.pdf', hideGuides, restoreGuides)
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
      const { pages, switchPage, currentPageId: originalPageId, showGuides: currentShowGuides } = useCanvasStore.getState()
      
      // 辅助线控制函数
      const hideGuides = () => {
        if (currentShowGuides) {
          useCanvasStore.getState().toggleShowGuides()
        }
      }
      
      const restoreGuides = () => {
        if (currentShowGuides) {
          useCanvasStore.getState().toggleShowGuides()
        }
      }
      
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

      await exportMultiPageToPDF(pages, selectedPageIds, renderPage, 'resume.pdf', hideGuides, restoreGuides)
      
      // 恢复原页面
      switchPage(originalPageId)
      
      setShowExportDialog(false)
    } catch (error) {
      alert('导出PDF失败: ' + (error as Error).message)
    }
  }

  const handleExportImage = async () => {
    const { showGuides: currentShowGuides } = useCanvasStore.getState()
    
    // 辅助线控制函数
    const hideGuides = () => {
      if (currentShowGuides) {
        useCanvasStore.getState().toggleShowGuides()
      }
    }
    
    const restoreGuides = () => {
      if (currentShowGuides) {
        useCanvasStore.getState().toggleShowGuides()
      }
    }
    
    const canvas = document.querySelector('.konvajs-content') as HTMLElement
    if (canvas) {
      try {
        await exportToImage(canvas, 'resume.png', hideGuides, restoreGuides)
      } catch (error) {
        alert('导出图片失败')
      }
    }
  }

  const handleExportWord = async () => {
    const { pages } = useCanvasStore.getState()
    
    if (pages.length === 1) {
      // 单页面直接导出
      try {
        await exportToWord(pages[0], 'resume.docx')
      } catch (error) {
        alert('导出Word失败: ' + (error as Error).message)
      }
    } else {
      // 多页面显示选择对话框
      setShowWordExportDialog(true)
    }
  }

  const handleMultiPageWordExport = async (selectedPageIds: string[]) => {
    if (selectedPageIds.length === 0) {
      alert('请至少选择一个页面')
      return
    }

    try {
      const { pages } = useCanvasStore.getState()
      await exportMultiPageToWord(pages, selectedPageIds, 'resume.docx')
      setShowWordExportDialog(false)
      setSelectedWordExportPages([])
    } catch (error) {
      alert('导出Word失败: ' + (error as Error).message)
    }
  }

  const handleExportJSON = () => {
    const state = useCanvasStore.getState()
    // 导出完整状态
    exportFullStateToJSON({
      pages: state.pages,
      currentPageId: state.currentPageId,
      groups: state.groups,
      guides: state.guides,
      showGuides: state.showGuides,
      canvasSize: state.canvasSize,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
    })
  }

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // 尝试导入完整状态
      const data = await importFullStateFromJSON(file)
      const { loadFullState } = useCanvasStore.getState()
      loadFullState(data)
    } catch (error) {
      // 如果失败，尝试作为旧版本组件列表导入
      try {
        const components = await importFromJSON(file)
        loadTemplate(components)
      } catch (legacyError) {
        alert('导入失败: ' + (error as Error).message)
      }
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
        <button
          onClick={() => setShowColorThemePanel(!showColorThemePanel)}
          className={`p-2 hover:bg-gray-100 rounded ${
            showColorThemePanel ? 'bg-purple-50 text-purple-600' : ''
          }`}
          title="配色方案"
        >
          <Palette size={18} />
        </button>
      </div>

      {/* 基础组件 */}
      <div className="flex gap-1 border-r pr-2">
        <button
          onClick={addText}
          className="p-2 hover:bg-gray-100 rounded"
          title="添加文本"
        >
          <Type size={18} />
        </button>
        <button
          onClick={addImage}
          className="p-2 hover:bg-gray-100 rounded"
          title="添加图片"
        >
          <Image size={18} />
        </button>
        <button
          onClick={() => addShape(ShapeType.RECTANGLE)}
          className="p-2 hover:bg-gray-100 rounded"
          title="添加矩形"
        >
          <Square size={18} />
        </button>
        <button
          onClick={() => addShape(ShapeType.CIRCLE)}
          className="p-2 hover:bg-gray-100 rounded"
          title="添加圆形"
        >
          <Circle size={18} />
        </button>
        <button
          onClick={addLine}
          className="p-2 hover:bg-gray-100 rounded"
          title="添加线条"
        >
          <Minus size={18} />
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

      {/* 配色方案面板 */}
      {showColorThemePanel && (
        <div className="absolute top-12 left-20 bg-white border rounded-lg shadow-lg p-4 z-50 w-80 max-h-[600px] overflow-y-auto">
          <h3 className="text-sm font-semibold mb-2">配色方案</h3>
          <p className="text-xs text-gray-500 mb-4">一键切换简历配色风格</p>
          
          <div className="grid grid-cols-2 gap-3">
            {COLOR_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  applyColorTheme(theme)
                  setShowColorThemePanel(false)
                }}
                className="border rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.colors.secondary }}
                    />
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: theme.colors.text.heading }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium mb-1">{theme.name}</div>
                <div className="text-xs text-gray-500">{theme.description}</div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowColorThemePanel(false)}
            className="mt-4 w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
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
          className={`px-3 py-2 rounded text-sm font-medium flex items-center gap-1 ${
            selectedIds.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
          }`}
          title="复制选中组件 (Ctrl+C)"
          disabled={selectedIds.length === 0}
        >
          <Copy size={16} />
          复制
        </button>
        <button
          onClick={paste}
          className="px-3 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded text-sm font-medium flex items-center gap-1 border border-green-200"
          title="粘贴 (Ctrl+V)"
        >
          <Clipboard size={16} />
          粘贴
        </button>
        <button
          onClick={deleteSelectedComponents}
          className={`px-3 py-2 rounded text-sm font-medium flex items-center gap-1 ${
            selectedIds.length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
          }`}
          title="删除选中组件 (Delete)"
          disabled={selectedIds.length === 0}
        >
          <Trash2 size={16} />
          删除
        </button>
      </div>

      {/* 层级操作 */}
      {selectedIds.length > 0 && (
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => {
              selectedIds.forEach((id) => bringToFront(id))
            }}
            className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-sm font-medium flex items-center gap-1 border border-indigo-200"
            title="置于顶层"
          >
            <ArrowUpToLine size={16} />
            置顶
          </button>
          <button
            onClick={() => {
              selectedIds.forEach((id) => sendToBack(id))
            }}
            className="px-3 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-sm font-medium flex items-center gap-1 border border-indigo-200"
            title="置于底层"
          >
            <ArrowDownToLine size={16} />
            置底
          </button>
        </div>
      )}

      {/* 分组操作 */}
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
            className="px-3 py-2 bg-teal-50 text-teal-600 hover:bg-teal-100 rounded text-sm font-medium flex items-center gap-1 border border-teal-200"
            title={(() => {
              const { components, selectedIds, groups } = useCanvasStore.getState()
              const selectedComponents = components.filter((c) => selectedIds.includes(c.id))
              const groupIds = [...new Set(selectedComponents.map((c) => c.groupId).filter(Boolean))]
              const currentGroup = groupIds.length === 1 ? groups.find((g) => g.id === groupIds[0]) : undefined
              return currentGroup ? '解除分组' : '创建分组'
            })()}
          >
            {(() => {
              const { components, selectedIds, groups } = useCanvasStore.getState()
              const selectedComponents = components.filter((c) => selectedIds.includes(c.id))
              const groupIds = [...new Set(selectedComponents.map((c) => c.groupId).filter(Boolean))]
              const currentGroup = groupIds.length === 1 ? groups.find((g) => g.id === groupIds[0]) : undefined
              return currentGroup ? (
                <>
                  <Ungroup size={16} />
                  解除分组
                </>
              ) : (
                <>
                  <Group size={16} />
                  分组
                </>
              )
            })()}
          </button>
        </div>
      )}

      {/* 对齐与分散 */}
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
            onClick={() => alignComponents('top')}
            className="p-2 hover:bg-gray-100 rounded"
            title="顶部对齐"
          >
            <AlignStartVertical size={18} />
          </button>
          <button
            onClick={() => alignComponents('middle')}
            className="p-2 hover:bg-gray-100 rounded"
            title="垂直居中"
          >
            <AlignVerticalJustifyCenter size={18} />
          </button>
          <button
            onClick={() => alignComponents('bottom')}
            className="p-2 hover:bg-gray-100 rounded"
            title="底部对齐"
          >
            <AlignEndVertical size={18} />
          </button>
        </div>
      )}

      {/* 分散 */}
      {selectedIds.length >= 3 && (
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => distributeComponents('horizontal')}
            className="p-2 hover:bg-gray-100 rounded"
            title="水平分散"
          >
            <AlignHorizontalJustifyCenter size={18} />
          </button>
          <button
            onClick={() => distributeComponents('vertical')}
            className="p-2 hover:bg-gray-100 rounded"
            title="垂直分散"
          >
            <AlignVerticalJustifyCenter size={18} className="rotate-90" />
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
        <button
          onClick={() => useCanvasStore.getState().toggleShowGuides()}
          className={`p-2 hover:bg-gray-100 rounded ${
            useCanvasStore.getState().showGuides ? 'bg-green-50 text-green-600' : ''
          }`}
          title="显示辅助线"
        >
          <Ruler size={18} />
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
          onClick={handleExportWord}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          title="导出Word"
        >
          <Download size={18} className="inline mr-1" />
          Word
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

      {/* 清空画布 */}
      <button
        onClick={handleClearCanvas}
        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium flex items-center gap-1 border-2 border-red-300"
        title="清空当前页面所有内容"
      >
        <X size={16} strokeWidth={2.5} />
        清空画布
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

      {/* Word导出对话框 */}
      {showWordExportDialog && (
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
                    checked={selectedWordExportPages.includes(page.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedWordExportPages([...selectedWordExportPages, page.id])
                      } else {
                        setSelectedWordExportPages(selectedWordExportPages.filter((id) => id !== page.id))
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
                  setSelectedWordExportPages(allPageIds)
                }}
                className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                全选
              </button>
              <button
                onClick={() => setSelectedWordExportPages([])}
                className="flex-1 px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                清空
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setShowWordExportDialog(false)
                  setSelectedWordExportPages([])
                }}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => handleMultiPageWordExport(selectedWordExportPages)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                disabled={selectedWordExportPages.length === 0}
              >
                导出 ({selectedWordExportPages.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Toolbar
