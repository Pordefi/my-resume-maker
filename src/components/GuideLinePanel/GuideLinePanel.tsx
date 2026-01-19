import { Eye, EyeOff, Trash2, Plus, Layout } from 'lucide-react'
import { useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'
import { GUIDE_LINE_LAYOUTS, GuideLineType } from '@/types/canvas'

const GuideLinePanel = () => {
  const {
    guides,
    showGuides,
    toggleShowGuides,
    removeGuideLine,
    toggleGuideLineVisibility,
    clearGuideLines,
    loadGuideLineLayout,
    addGuideLine,
  } = useCanvasStore()

  const [showLayoutMenu, setShowLayoutMenu] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [newGuidePosition, setNewGuidePosition] = useState('')

  const handleAddGuideLine = (type: GuideLineType) => {
    const position = parseFloat(newGuidePosition)
    if (isNaN(position)) {
      alert('请输入有效的数字')
      return
    }

    addGuideLine({
      type,
      position,
      color: type === GuideLineType.VERTICAL ? '#3b82f6' : '#10b981',
      visible: true,
    })

    setNewGuidePosition('')
    setShowAddMenu(false)
  }

  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">辅助线</h3>
        <button
          onClick={toggleShowGuides}
          className={`p-1.5 rounded ${
            showGuides ? 'bg-blue-50 text-blue-600' : 'text-gray-400'
          }`}
          title={showGuides ? '隐藏辅助线' : '显示辅助线'}
        >
          {showGuides ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      {/* 布局模板 */}
      <div className="mb-3">
        <button
          onClick={() => setShowLayoutMenu(!showLayoutMenu)}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center justify-center gap-2"
        >
          <Layout size={14} />
          加载布局模板
        </button>

        {showLayoutMenu && (
          <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
            {GUIDE_LINE_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => {
                  loadGuideLineLayout(layout.id)
                  setShowLayoutMenu(false)
                }}
                className="w-full p-2 text-left border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-xs font-medium text-gray-900">
                  {layout.name}
                </div>
                <div className="text-[10px] text-gray-500">
                  {layout.description}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 添加辅助线 */}
      <div className="mb-3">
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm flex items-center justify-center gap-2"
        >
          <Plus size={14} />
          添加辅助线
        </button>

        {showAddMenu && (
          <div className="mt-2 p-3 border border-gray-300 rounded bg-gray-50">
            <input
              type="number"
              value={newGuidePosition}
              onChange={(e) => setNewGuidePosition(e.target.value)}
              placeholder="位置 (px)"
              className="w-full px-2 py-1 border rounded text-sm mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAddGuideLine(GuideLineType.VERTICAL)}
                className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
              >
                垂直线
              </button>
              <button
                onClick={() => handleAddGuideLine(GuideLineType.HORIZONTAL)}
                className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
              >
                水平线
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 辅助线列表 */}
      {guides.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">
              当前辅助线 ({guides.length})
            </span>
            <button
              onClick={clearGuideLines}
              className="text-xs text-red-600 hover:text-red-700"
            >
              清空全部
            </button>
          </div>

          <div className="space-y-1 max-h-40 overflow-y-auto">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
              >
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: guide.color }}
                  />
                  <span className="text-gray-700">
                    {guide.type === GuideLineType.VERTICAL ? '垂直' : '水平'} -{' '}
                    {guide.position}px
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => toggleGuideLineVisibility(guide.id)}
                    className="p-1 hover:bg-gray-200 rounded"
                    title={guide.visible ? '隐藏' : '显示'}
                  >
                    {guide.visible ? (
                      <Eye size={12} />
                    ) : (
                      <EyeOff size={12} className="text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => removeGuideLine(guide.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                    title="删除"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {guides.length === 0 && (
        <div className="text-center text-xs text-gray-500 py-3">
          暂无辅助线，点击上方按钮添加
        </div>
      )}
    </div>
  )
}

export default GuideLinePanel
