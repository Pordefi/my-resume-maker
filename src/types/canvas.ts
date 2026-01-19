// 画布尺寸类型
export enum CanvasSize {
  A4 = 'a4',
  INFINITE = 'infinite',
}

// 画布配置
export const CANVAS_CONFIGS = {
  [CanvasSize.A4]: {
    width: 794, // A4宽度 210mm 转像素 (210mm * 3.7795px/mm)
    height: 1123, // A4高度 297mm 转像素
    backgroundColor: '#ffffff',
    gridSize: 10,
  },
  [CanvasSize.INFINITE]: {
    width: 3000,
    height: 3000,
    backgroundColor: '#ffffff',
    gridSize: 20,
  },
} as const

export const CANVAS_CONFIG = CANVAS_CONFIGS[CanvasSize.A4]

// 组件类型
export enum ComponentType {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  ICON = 'icon',
}

// 形状类型
export enum ShapeType {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
}

// 对齐方式
export enum AlignType {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  TOP = 'top',
  MIDDLE = 'middle',
  BOTTOM = 'bottom',
}

// 基础组件属性
export interface BaseComponent {
  id: string
  type: ComponentType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  locked: boolean
  visible: boolean
  groupId?: string // 所属组ID
  // 通用样式
  shadow?: {
    enabled: boolean
    color: string
    blur: number
    offsetX: number
    offsetY: number
    opacity: number
  }
}

// 文本组件
export interface TextComponent extends BaseComponent {
  type: ComponentType.TEXT
  text: string
  fontSize: number
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  textAlign: 'left' | 'center' | 'right'
  color: string
  lineHeight: number
  letterSpacing: number
}

// 图片组件
export interface ImageComponent extends BaseComponent {
  type: ComponentType.IMAGE
  src: string
  opacity: number
  borderRadius: number
}

// 形状组件
export interface ShapeComponent extends BaseComponent {
  type: ComponentType.SHAPE
  shapeType: ShapeType
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
  borderRadius: number
  // 支持内嵌文本
  text?: string
  fontSize?: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold'
  textColor?: string
  textAlign?: 'left' | 'center' | 'right'
}

// 线条组件
export interface LineComponent extends BaseComponent {
  type: ComponentType.LINE
  points: number[]
  stroke: string
  strokeWidth: number
  dash: number[]
}

// 图标组件
export interface IconComponent extends BaseComponent {
  type: ComponentType.ICON
  iconName: string
  color: string
}

// 联合类型
export type CanvasComponent =
  | TextComponent
  | ImageComponent
  | ShapeComponent
  | LineComponent
  | IconComponent

// 页面数据
export interface Page {
  id: string
  name: string
  components: CanvasComponent[]
  backgroundColor: string
}

// 组件组
export interface ComponentGroup {
  id: string
  name: string
  componentIds: string[]
  locked: boolean
  visible: boolean
}

// 画布状态
export interface CanvasState {
  pages: Page[]
  currentPageId: string
  components: CanvasComponent[]
  groups: ComponentGroup[]
  selectedIds: string[]
  clipboard: CanvasComponent[]
  history: CanvasComponent[][]
  historyIndex: number
  zoom: number
  showGrid: boolean
  showRuler: boolean
  canvasSize: CanvasSize
  canvasWidth: number
  canvasHeight: number
  canvasBackgroundColor: string
}

// 模板
export interface Template {
  id: string
  name: string
  thumbnail: string
  components: CanvasComponent[]
  createdAt: number
  updatedAt: number
}
