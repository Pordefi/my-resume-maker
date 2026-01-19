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

// 颜色分类函数 - 判断颜色属于哪个类别
export const classifyColor = (color: string): 'primary' | 'secondary' | 'accent' | 'heading' | 'body' | 'muted' | 'border' | 'background' | 'unknown' => {
  const c = color.toLowerCase()
  
  // 主色调（蓝色、绿色、紫色等鲜艳颜色）
  const primaryColors = ['#3b82f6', '#2563eb', '#1d4ed8', '#10b981', '#059669', '#8b5cf6', '#7c3aed', '#ef4444', '#dc2626', '#f97316', '#ea580c', '#14b8a6', '#0d9488']
  if (primaryColors.some(pc => c === pc)) return 'primary'
  
  // 次要色（较浅的主色调）
  const secondaryColors = ['#60a5fa', '#93c5fd', '#34d399', '#6ee7b7', '#a78bfa', '#c4b5fd', '#f87171', '#fca5a5', '#fb923c', '#fdba74', '#2dd4bf', '#5eead4']
  if (secondaryColors.some(sc => c === sc)) return 'secondary'
  
  // 标题色（深色）
  const headingColors = ['#1e40af', '#1e3a8a', '#065f46', '#064e3b', '#5b21b6', '#4c1d95', '#991b1b', '#7f1d1d', '#9a3412', '#7c2d12', '#115e59', '#134e4a', '#111827', '#000000']
  if (headingColors.some(hc => c === hc)) return 'heading'
  
  // 正文色（中等深度）
  const bodyColors = ['#1f2937', '#374151', '#4b5563']
  if (bodyColors.some(bc => c === bc)) return 'body'
  
  // 次要文字色（灰色）
  const mutedColors = ['#6b7280', '#9ca3af', '#d1d5db']
  if (mutedColors.some(mc => c === mc)) return 'muted'
  
  // 边框/分割线色
  const borderColors = ['#d1d5db', '#e5e7eb', '#f3f4f6']
  if (borderColors.some(bc => c === bc)) return 'border'
  
  // 背景色
  const backgroundColors = ['#ffffff', '#f9fafb', '#f3f4f6', '#f0fdf4', '#faf5ff', '#fef2f2', '#fff7ed', '#f0fdfa']
  if (backgroundColors.some(bg => c === bg)) return 'background'
  
  return 'unknown'
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
