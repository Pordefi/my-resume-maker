import { useCanvasStore } from '@/store/canvasStore'
import { Users, Lock, Unlock, Eye, EyeOff, Ungroup } from 'lucide-react'

const GroupProperties = () => {
  const { 
    components, 
    selectedIds, 
    groups, 
    createGroup, 
    ungroupComponents,
    toggleGroupLock,
    toggleGroupVisibility,
  } = useCanvasStore()

  // 安全检查
  if (!components || !selectedIds || !groups) {
    return null
  }

  // 检查选中的组件是否都属于同一个组
  const selectedComponents = components.filter((c) => selectedIds.includes(c.id))
  const groupIds = [...new Set(selectedComponents.map((c) => c.groupId).filter(Boolean))]
  const currentGroup = groupIds.length === 1 ? groups.find((g) => g.id === groupIds[0]) : undefined

  // 检查是否可以创建组（至少2个组件且不都在同一个组）
  const canCreateGroup = selectedIds.length >= 2 && !currentGroup

  // 如果只选中一个组件且不在组中，不显示组管理
  if (selectedIds.length === 1 && !currentGroup) {
    return null
  }

  return (
    <div className="p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Users size={16} />
        组管理
      </h3>

      {currentGroup ? (
        <div className="space-y-3">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">
                {currentGroup.name}
              </span>
              <span className="text-xs text-blue-600">
                {currentGroup.componentIds.length} 个组件
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => toggleGroupLock(currentGroup.id)}
                className={`flex-1 px-2 py-1.5 border rounded text-xs flex items-center justify-center gap-1 ${
                  currentGroup.locked
                    ? 'bg-red-50 border-red-300 text-red-700'
                    : 'bg-white hover:bg-gray-50'
                }`}
                title={currentGroup.locked ? '解锁组' : '锁定组'}
              >
                {currentGroup.locked ? <Lock size={12} /> : <Unlock size={12} />}
                {currentGroup.locked ? '已锁定' : '未锁定'}
              </button>
              
              <button
                onClick={() => toggleGroupVisibility(currentGroup.id)}
                className={`flex-1 px-2 py-1.5 border rounded text-xs flex items-center justify-center gap-1 ${
                  !currentGroup.visible
                    ? 'bg-gray-50 border-gray-300'
                    : 'bg-white hover:bg-gray-50'
                }`}
                title={currentGroup.visible ? '隐藏组' : '显示组'}
              >
                {currentGroup.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                {currentGroup.visible ? '可见' : '隐藏'}
              </button>
            </div>
          </div>

          <button
            onClick={() => ungroupComponents(currentGroup.id)}
            className="w-full px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded hover:bg-red-100 text-sm flex items-center justify-center gap-2"
          >
            <Ungroup size={14} />
            解散组
          </button>
        </div>
      ) : canCreateGroup ? (
        <button
          onClick={() => createGroup()}
          className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm flex items-center justify-center gap-2"
        >
          <Users size={14} />
          创建组 ({selectedIds.length} 个组件)
        </button>
      ) : (
        <div className="text-center text-xs text-gray-500 py-3">
          {selectedIds.length < 2
            ? '选择至少 2 个组件来创建组'
            : '选中的组件已在不同的组中'}
        </div>
      )}

      {/* 所有组列表 */}
      {groups.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-xs font-medium text-gray-600 mb-2">所有组</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {groups.map((group) => (
              <div
                key={group.id}
                className="p-2 bg-gray-50 rounded text-xs flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{group.name}</div>
                  <div className="text-gray-500">{group.componentIds.length} 个组件</div>
                </div>
                <div className="flex gap-1">
                  {group.locked && <Lock size={12} className="text-red-600" />}
                  {!group.visible && <EyeOff size={12} className="text-gray-400" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GroupProperties
