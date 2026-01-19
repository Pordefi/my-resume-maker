// 配色方案定义
export interface ColorTheme {
  id: string
  name: string
  description: string
  colors: {
    primary: string      // 主色调
    secondary: string    // 次要色
    accent: string       // 强调色
    text: {
      heading: string    // 标题文字
      body: string       // 正文文字
      muted: string      // 次要文字
    }
    background: {
      main: string       // 主背景
      card: string       // 卡片背景
    }
    border: string       // 边框/分割线
  }
}

// 预设配色方案
export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'blue',
    name: '经典蓝',
    description: '专业稳重的蓝色系',
    colors: {
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#2563eb',
      text: {
        heading: '#1e40af',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#f3f4f6',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'gray',
    name: '商务灰',
    description: '简约专业的灰色系',
    colors: {
      primary: '#4b5563',
      secondary: '#6b7280',
      accent: '#374151',
      text: {
        heading: '#111827',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#f9fafb',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'black',
    name: '极简黑',
    description: '现代简约的黑白系',
    colors: {
      primary: '#000000',
      secondary: '#374151',
      accent: '#1f2937',
      text: {
        heading: '#000000',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#f9fafb',
      },
      border: '#e5e7eb',
    },
  },
  {
    id: 'green',
    name: '清新绿',
    description: '活力清新的绿色系',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#059669',
      text: {
        heading: '#065f46',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#f0fdf4',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'purple',
    name: '优雅紫',
    description: '优雅大气的紫色系',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      accent: '#7c3aed',
      text: {
        heading: '#5b21b6',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#faf5ff',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'red',
    name: '活力红',
    description: '热情活力的红色系',
    colors: {
      primary: '#ef4444',
      secondary: '#f87171',
      accent: '#dc2626',
      text: {
        heading: '#991b1b',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#fef2f2',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'orange',
    name: '温暖橙',
    description: '温暖友好的橙色系',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#ea580c',
      text: {
        heading: '#9a3412',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#fff7ed',
      },
      border: '#d1d5db',
    },
  },
  {
    id: 'teal',
    name: '科技青',
    description: '现代科技的青色系',
    colors: {
      primary: '#14b8a6',
      secondary: '#2dd4bf',
      accent: '#0d9488',
      text: {
        heading: '#115e59',
        body: '#1f2937',
        muted: '#6b7280',
      },
      background: {
        main: '#ffffff',
        card: '#f0fdfa',
      },
      border: '#d1d5db',
    },
  },
]

// 将hex颜色转换为HSL
const hexToHSL = (hex: string): { h: number; s: number; l: number } => {
  // 移除#号
  hex = hex.replace('#', '')
  
  // 转换为RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

// 颜色分类函数 - 基于HSL值智能判断
export const classifyColor = (color: string): 'primary' | 'secondary' | 'accent' | 'heading' | 'body' | 'muted' | 'border' | 'background' | 'unknown' => {
  const c = color.toLowerCase()
  
  // 特殊颜色处理
  if (c === '#ffffff' || c === '#fff') return 'background'
  if (c === '#000000' || c === '#000') return 'heading'
  
  try {
    const { s, l } = hexToHSL(c)
    
    // 背景色：高亮度（>95%）或极低饱和度且高亮度（>90%）
    if (l > 95 || (s < 10 && l > 90)) {
      return 'background'
    }
    
    // 边框/分割线：低饱和度（<15%）且中高亮度（70-90%）
    if (s < 15 && l >= 70 && l <= 90) {
      return 'border'
    }
    
    // 次要文字色（灰色）：低饱和度（<15%）且中等亮度（40-70%）
    if (s < 15 && l >= 40 && l < 70) {
      return 'muted'
    }
    
    // 正文色：低饱和度（<20%）且较低亮度（20-40%）
    if (s < 20 && l >= 20 && l < 40) {
      return 'body'
    }
    
    // 标题色：低饱和度（<30%）且低亮度（<20%）或高饱和度但低亮度（<30%）
    if ((s < 30 && l < 20) || (s >= 30 && l < 30)) {
      return 'heading'
    }
    
    // 主色调：高饱和度（>40%）且中等亮度（40-60%）
    if (s > 40 && l >= 40 && l <= 60) {
      return 'primary'
    }
    
    // 次要色：高饱和度（>40%）且较高亮度（60-80%）
    if (s > 40 && l > 60 && l <= 80) {
      return 'secondary'
    }
    
    // 强调色：高饱和度（>50%）且较低亮度（30-40%）
    if (s > 50 && l >= 30 && l < 40) {
      return 'accent'
    }
    
    // 默认根据亮度和饱和度判断
    if (s > 30) {
      // 有颜色的
      if (l < 40) return 'accent'
      if (l < 60) return 'primary'
      return 'secondary'
    } else {
      // 灰色系
      if (l < 30) return 'heading'
      if (l < 50) return 'body'
      if (l < 80) return 'muted'
      return 'border'
    }
  } catch (error) {
    console.warn('颜色分类失败:', color, error)
    return 'unknown'
  }
}

// 应用配色方案到颜色
export const applyThemeToColor = (originalColor: string, theme: ColorTheme): string => {
  const category = classifyColor(originalColor)
  
  switch (category) {
    case 'primary':
      return theme.colors.primary
    case 'secondary':
      return theme.colors.secondary
    case 'accent':
      return theme.colors.accent
    case 'heading':
      return theme.colors.text.heading
    case 'body':
      return theme.colors.text.body
    case 'muted':
      return theme.colors.text.muted
    case 'border':
      return theme.colors.border
    case 'background':
      return theme.colors.background.main
    default:
      // 未识别的颜色保持不变
      return originalColor
  }
}
