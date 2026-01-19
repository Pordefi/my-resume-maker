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

export const createTextComponent = (
  x: number,
  y: number,
  text = '文本内容'
): TextComponent => ({
  id: generateId('text'),
  type: ComponentType.TEXT,
  x,
  y,
  width: 200,
  height: 40,
  rotation: 0,
  zIndex: 0,
  locked: false,
  visible: true,
  text,
  fontSize: 16,
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'normal',
  fontStyle: 'normal',
  textAlign: 'left',
  color: '#000000',
  lineHeight: 1.5,
  letterSpacing: 0,
})

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
  shapeType: ShapeType = ShapeType.RECTANGLE
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
  fill: '#3b82f6',
  stroke: '#1e40af',
  strokeWidth: 2,
  opacity: 1,
  borderRadius: 0,
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
  width: horizontal ? 200 : 0,
  height: horizontal ? 0 : 200,
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
