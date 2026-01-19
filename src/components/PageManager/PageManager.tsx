import { Plus, Copy, Trash2, Edit2, Check, X } from 'lucide-react'
import { useState } from 'react'
import { useCanvasStore } from '@/store/canvasStore'

const PageManager = () => {
  const { pages, currentPageId, addPage, deletePage, switchPage, renamePage, duplicatePage } =
    useCanvasStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id)
    setEditingName(name)
  }

  const handleSaveEdit = () => {
    if (editingId && editingName.trim()) {
      renamePage(editingId, editingName.trim())
    }
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
      <span className="text-sm text-gray-600 font-medium whitespace-nowrap">页面:</span>
      
      <div className="flex gap-2 flex-1 overflow-x-auto">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-colors ${
              currentPageId === page.id
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-50 hover:bg-gray-100 border-gray-300'
            }`}
          >
            {editingId === page.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit()
                    if (e.key === 'Escape') handleCancelEdit()
                  }}
                  className="w-24 px-1 py-0.5 text-sm border rounded text-gray-900"
                  autoFocus
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-0.5 hover:bg-green-100 rounded"
                  title="保存"
                >
                  <Check size={14} className="text-green-600" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-0.5 hover:bg-red-100 rounded"
                  title="取消"
                >
                  <X size={14} className="text-red-600" />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => switchPage(page.id)}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {page.name}
                </button>
                
                {currentPageId === page.id && (
                  <div className="flex items-center gap-1 ml-1">
                    <button
                      onClick={() => handleStartEdit(page.id, page.name)}
                      className="p-0.5 hover:bg-blue-600 rounded"
                      title="重命名"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => duplicatePage(page.id)}
                      className="p-0.5 hover:bg-blue-600 rounded"
                      title="复制页面"
                    >
                      <Copy size={12} />
                    </button>
                    {pages.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm(`确定要删除"${page.name}"吗？`)) {
                            deletePage(page.id)
                          }
                        }}
                        className="p-0.5 hover:bg-red-500 rounded"
                        title="删除页面"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addPage}
        className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap text-sm"
        title="添加页面"
      >
        <Plus size={16} />
        新页面
      </button>
    </div>
  )
}

export default PageManager
