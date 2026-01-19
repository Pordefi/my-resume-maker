import {
  CanvasComponent,
  ComponentType,
  ShapeType,
  TextComponent,
  ImageComponent,
  ShapeComponent,
  LineComponent,
  IconComponent,
} from '@/types/canvas'

const generateId = (type: string) => `${type}-${Date.now()}-${Math.random()}`

// 辅助函数：根据文本内容估算宽度
const estimateTextWidth = (text: string, fontSize: number): number => {
  // 中文字符约为fontSize的1倍宽度，英文字符约为fontSize的0.6倍
  let width = 0
  for (const char of text) {
    if (/[\u4e00-\u9fa5]/.test(char)) {
      // 中文字符
      width += fontSize
    } else {
      // 英文字符和其他
      width += fontSize * 0.6
    }
  }
  // 添加一些padding，最小宽度50，最大宽度600
  return Math.min(Math.max(width + 20, 50), 600)
}

// 辅助函数：根据文本内容估算高度
const estimateTextHeight = (text: string, fontSize: number, lineHeight: number): number => {
  const lines = text.split('\n').length
  return fontSize * lineHeight * lines + 10
}

export const createTextComponent = (
  x: number,
  y: number,
  text = '文本内容',
  fontSize = 16
): TextComponent => {
  const lineHeight = 1.5
  const width = estimateTextWidth(text, fontSize)
  const height = estimateTextHeight(text, fontSize, lineHeight)
  
  return {
    id: generateId('text'),
    type: ComponentType.TEXT,
    x,
    y,
    width,
    height,
    rotation: 0,
    zIndex: 0,
    locked: false,
    visible: true,
    text,
    fontSize,
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#000000',
    lineHeight,
    letterSpacing: 0,
  }
}

export const createImageComponent = (
  x: number,
  y: number,
  src: string
): ImageComponent => ({
  id: generateId('image'),
  type: ComponentType.IMAGE,
  x,
  y,
  width: 150,
  height: 150,
  rotation: 0,
  zIndex: 0,
  locked: false,
  visible: true,
  src,
  opacity: 1,
  borderRadius: 0,
})

export const createShapeComponent = (
  x: number,
  y: number,
  shapeType: ShapeType = ShapeType.RECTANGLE,
  text?: string
): ShapeComponent => ({
  id: generateId('shape'),
  type: ComponentType.SHAPE,
  x,
  y,
  width: 100,
  height: 100,
  rotation: 0,
  zIndex: 0,
  locked: false,
  visible: true,
  shapeType,
  fill: '#ffffff',
  stroke: '#d1d5db',
  strokeWidth: 1,
  opacity: 1,
  borderRadius: 0,
  text: text || '',
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  textColor: '#000000',
  textAlign: 'center',
})

export const createLineComponent = (
  x: number,
  y: number,
  horizontal = true
): LineComponent => ({
  id: generateId('line'),
  type: ComponentType.LINE,
  x,
  y,
  width: horizontal ? 200 : 10,
  height: horizontal ? 10 : 200,
  rotation: 0,
  zIndex: 0,
  locked: false,
  visible: true,
  points: horizontal ? [0, 0, 200, 0] : [0, 0, 0, 200],
  stroke: '#000000',
  strokeWidth: 2,
  dash: [],
})

export const createIconComponent = (
  x: number,
  y: number,
  iconName = 'star'
): IconComponent => ({
  id: generateId('icon'),
  type: ComponentType.ICON,
  x,
  y,
  width: 40,
  height: 40,
  rotation: 0,
  zIndex: 0,
  locked: false,
  visible: true,
  iconName,
  color: '#000000',
})

// 预设模板组件
export const createHeaderTemplate = (): CanvasComponent[] => [
  createTextComponent(50, 50, '张三'),
  createTextComponent(50, 100, '前端工程师'),
  createLineComponent(50, 150, true),
]

export const createContactTemplate = (): CanvasComponent[] => [
  createTextComponent(50, 200, '联系方式'),
  createTextComponent(50, 240, '电话: 138-0000-0000'),
  createTextComponent(50, 270, '邮箱: example@email.com'),
  createTextComponent(50, 300, '地址: 北京市朝阳区'),
]
