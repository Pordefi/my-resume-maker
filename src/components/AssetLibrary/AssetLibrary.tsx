import { useState, useEffect } from 'react'
import { Search, Download, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react'
import { useCanvasStore } from '@/store/canvasStore'
import { createImageComponent } from '@/utils/componentFactory'
import {
  searchUnsplashImages,
  searchIconifyIcons,
  downloadAndCacheImage,
  svgToBase64,
  UnsplashImage,
  IconifyIcon,
  cleanExpiredCache,
} from '@/services/assetService'

type AssetType = 'images' | 'icons'

const AssetLibrary = () => {
  const { addComponent } = useCanvasStore()
  const [activeType, setActiveType] = useState<AssetType>('images')
  const [searchQuery, setSearchQuery] = useState('')
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [icons, setIcons] = useState<IconifyIcon[]>([])
  const [loading, setLoading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // 清理过期缓存
  useEffect(() => {
    cleanExpiredCache()
  }, [])

  // 加载默认图片
  useEffect(() => {
    if (activeType === 'images' && images.length === 0) {
      handleSearch('nature')
    }
  }, [activeType])

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      if (activeType === 'images') {
        const results = await searchUnsplashImages(searchTerm)
        setImages(results)
      } else {
        const results = await searchIconifyIcons(searchTerm)
        setIcons(results)
      }
    } catch (error) {
      alert('搜索失败: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async (image: UnsplashImage) => {
    setDownloadingId(image.id)
    try {
      // 下载并缓存图片
      const base64 = await downloadAndCacheImage(image.urls.regular, image.id)
      
      // 添加到画布
      const imageComponent = createImageComponent(100, 100, base64)
      addComponent(imageComponent)
    } catch (error) {
      alert('添加图片失败: ' + (error as Error).message)
    } finally {
      setDownloadingId(null)
    }
  }

  const handleAddIcon = (icon: IconifyIcon) => {
    try {
      // 将SVG转为Base64
      const base64 = svgToBase64(icon.svg)
      
      // 添加到画布
      const imageComponent = createImageComponent(100, 100, base64)
      imageComponent.width = 80
      imageComponent.height = 80
      addComponent(imageComponent)
    } catch (error) {
      alert('添加图标失败: ' + (error as Error).message)
    }
  }

  const quickSearches = activeType === 'images'
    ? ['商务', '科技', '自然', '人物', '办公']
    : ['用户', '设置', '邮件', '电话', '位置']

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">素材库</h2>

      {/* 类型切换 */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActiveType('images')}
          className={`flex-1 pb-2 text-sm font-medium flex items-center justify-center gap-1 ${
            activeType === 'images'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <ImageIcon size={16} />
          图片
        </button>
        <button
          onClick={() => setActiveType('icons')}
          className={`flex-1 pb-2 text-sm font-medium flex items-center justify-center gap-1 ${
            activeType === 'icons'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          <Sparkles size={16} />
          图标
        </button>
      </div>

      {/* 搜索框 */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={activeType === 'images' ? '搜索图片...' : '搜索图标...'}
            className="w-full pl-8 pr-3 py-2 border rounded text-sm"
          />
          <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>

        {/* 快速搜索 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {quickSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                setSearchQuery(term)
                handleSearch(term)
              }}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* 加载状态 */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* 图片网格 */}
      {!loading && activeType === 'images' && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group cursor-pointer rounded overflow-hidden border hover:border-blue-500 transition-colors"
              onClick={() => handleAddImage(image)}
            >
              <img
                src={image.urls.thumb}
                alt={image.alt_description || '图片'}
                className="w-full h-24 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                {downloadingId === image.id ? (
                  <Loader2 size={20} className="text-white animate-spin" />
                ) : (
                  <Download
                    size={20}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                )}
              </div>
              {image.user && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-1">
                  <p className="text-xs text-white truncate">{image.user.name}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 图标网格 */}
      {!loading && activeType === 'icons' && (
        <div className="grid grid-cols-4 gap-2">
          {icons.map((icon, index) => (
            <button
              key={`${icon.collection}-${icon.name}-${index}`}
              onClick={() => handleAddIcon(icon)}
              className="p-3 border rounded hover:border-blue-500 hover:bg-blue-50 transition-colors"
              title={`${icon.collection}:${icon.name}`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: icon.svg }}
                className="w-full h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && activeType === 'images' && images.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>暂无图片</p>
          <p className="mt-1">试试搜索一些关键词</p>
        </div>
      )}

      {!loading && activeType === 'icons' && icons.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          <p>暂无图标</p>
          <p className="mt-1">试试搜索一些关键词</p>
        </div>
      )}

      {/* 提示 */}
      <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">💡 提示:</p>
        <ul className="space-y-1">
          <li>• 点击素材添加到画布</li>
          <li>• 素材会自动缓存到本地</li>
          <li>• 图片来源: Picsum Photos</li>
          <li>• 图标来源: Iconify</li>
        </ul>
      </div>
    </div>
  )
}

export default AssetLibrary
