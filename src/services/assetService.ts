// 素材服务 - 从外部API获取图片和图标

const UNSPLASH_ACCESS_KEY = 'your_access_key_here' // 可选：用于更高的请求限制
const CACHE_PREFIX = 'asset_cache_'
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7天

interface CachedAsset {
  data: string
  timestamp: number
}

// 缓存管理
const getCachedAsset = (key: string): string | null => {
  try {
    const cached = localStorage.getItem(CACHE_PREFIX + key)
    if (!cached) return null

    const { data, timestamp }: CachedAsset = JSON.parse(cached)
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }

    return data
  } catch {
    return null
  }
}

const setCachedAsset = (key: string, data: string) => {
  try {
    const cached: CachedAsset = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cached))
  } catch (error) {
    console.warn('缓存失败:', error)
  }
}

// 图片转Base64
const imageUrlToBase64 = async (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('无法创建canvas上下文'))
        return
      }
      
      ctx.drawImage(img, 0, 0)
      
      try {
        const base64 = canvas.toDataURL('image/jpeg', 0.9)
        resolve(base64)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = url
  })
}

// Unsplash 图片搜索
export interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  user: {
    name: string
    username: string
  }
  description: string | null
  alt_description: string | null
}

export const searchUnsplashImages = async (
  query: string,
  page = 1,
  perPage = 20
): Promise<UnsplashImage[]> => {
  try {
    // 使用公共API端点（无需API key，但有限制）
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${perPage}&client_id=your_client_id`

    // 备用方案：使用 Picsum Photos（随机图片）
    const response = await fetch(
      `https://picsum.photos/v2/list?page=${page}&limit=${perPage}`
    )

    if (!response.ok) throw new Error('获取图片失败')

    const data = await response.json()
    
    // 转换为统一格式
    return data.map((item: any) => ({
      id: item.id,
      urls: {
        raw: item.download_url,
        full: item.download_url,
        regular: item.download_url,
        small: item.download_url,
        thumb: item.download_url,
      },
      user: {
        name: item.author,
        username: item.author,
      },
      description: null,
      alt_description: null,
    }))
  } catch (error) {
    console.error('搜索图片失败:', error)
    throw error
  }
}

// 下载并缓存图片
export const downloadAndCacheImage = async (
  imageUrl: string,
  imageId: string
): Promise<string> => {
  // 检查缓存
  const cached = getCachedAsset(imageId)
  if (cached) return cached

  try {
    // 下载并转换为Base64
    const base64 = await imageUrlToBase64(imageUrl)
    
    // 缓存
    setCachedAsset(imageId, base64)
    
    return base64
  } catch (error) {
    console.error('下载图片失败:', error)
    throw error
  }
}

// Iconify 图标搜索
export interface IconifyIcon {
  name: string
  collection: string
  svg: string
}

export const searchIconifyIcons = async (
  query: string,
  limit = 64
): Promise<IconifyIcon[]> => {
  try {
    // 搜索图标
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(
      query
    )}&limit=${limit}`

    const response = await fetch(searchUrl)
    if (!response.ok) throw new Error('搜索图标失败')

    const data = await response.json()
    const icons = data.icons || []

    // 获取图标SVG
    const iconPromises = icons.slice(0, 32).map(async (iconName: string) => {
      const [collection, name] = iconName.split(':')
      const svgUrl = `https://api.iconify.design/${collection}/${name}.svg`

      try {
        const svgResponse = await fetch(svgUrl)
        const svg = await svgResponse.text()

        return {
          name,
          collection,
          svg,
        }
      } catch {
        return null
      }
    })

    const results = await Promise.all(iconPromises)
    return results.filter((icon): icon is IconifyIcon => icon !== null)
  } catch (error) {
    console.error('搜索图标失败:', error)
    throw error
  }
}

// SVG转Base64
export const svgToBase64 = (svg: string): string => {
  const base64 = btoa(unescape(encodeURIComponent(svg)))
  return `data:image/svg+xml;base64,${base64}`
}

// 获取流行图标集合
export const getPopularIconCollections = () => [
  { id: 'mdi', name: 'Material Design Icons', prefix: 'mdi' },
  { id: 'fa', name: 'Font Awesome', prefix: 'fa' },
  { id: 'heroicons', name: 'Heroicons', prefix: 'heroicons' },
  { id: 'lucide', name: 'Lucide', prefix: 'lucide' },
  { id: 'carbon', name: 'Carbon', prefix: 'carbon' },
  { id: 'tabler', name: 'Tabler', prefix: 'tabler' },
]

// 清理过期缓存
export const cleanExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage)
    let cleaned = 0

    keys.forEach((key) => {
      if (key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const { timestamp }: CachedAsset = JSON.parse(cached)
            if (Date.now() - timestamp > CACHE_EXPIRY) {
              localStorage.removeItem(key)
              cleaned++
            }
          }
        } catch {
          localStorage.removeItem(key)
          cleaned++
        }
      }
    })

    console.log(`清理了 ${cleaned} 个过期缓存`)
  } catch (error) {
    console.error('清理缓存失败:', error)
  }
}
