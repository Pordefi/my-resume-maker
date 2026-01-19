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

// 辅助线类型
export enum GuideLineType {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

// 辅助线
export interface GuideLine {
  id: string
  type: GuideLineType
  position: number // x坐标（垂直线）或y坐标（水平线）
  color: string
  visible: boolean
}

// 辅助线布局模板
export interface GuideLineLayout {
  id: string
  name: string
  description: string
  guides: Omit<GuideLine, 'id'>[]
}

// 预设辅助线布局
export const GUIDE_LINE_LAYOUTS: GuideLineLayout[] = [
  {
    id: 'standard',
    name: '标准布局',
    description: '左右边距50px，上下边距40px',
    guides: [
      { type: GuideLineType.VERTICAL, position: 50, color: '#ef4444', visible: true },
      { type: GuideLineType.VERTICAL, position: 744, color: '#ef4444', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 40, color: '#ef4444', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 1083, color: '#ef4444', visible: true },
    ],
  },
  {
    id: 'twoColumn',
    name: '双栏布局',
    description: '左栏280px，右栏剩余',
    guides: [
      { type: GuideLineType.VERTICAL, position: 50, color: '#ef4444', visible: true },
      { type: GuideLineType.VERTICAL, position: 280, color: '#3b82f6', visible: true },
      { type: GuideLineType.VERTICAL, position: 744, color: '#ef4444', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 40, color: '#ef4444', visible: true },
    ],
  },
  {
    id: 'threeColumn',
    name: '三栏布局',
    description: '三等分布局',
    guides: [
      { type: GuideLineType.VERTICAL, position: 50, color: '#ef4444', visible: true },
      { type: GuideLineType.VERTICAL, position: 281, color: '#3b82f6', visible: true },
      { type: GuideLineType.VERTICAL, position: 513, color: '#3b82f6', visible: true },
      { type: GuideLineType.VERTICAL, position: 744, color: '#ef4444', visible: true },
    ],
  },
  {
    id: 'center',
    name: '居中对齐',
    description: '中心线辅助',
    guides: [
      { type: GuideLineType.VERTICAL, position: 397, color: '#10b981', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 561.5, color: '#10b981', visible: true },
    ],
  },
  {
    id: 'grid',
    name: '网格布局',
    description: '四等分网格',
    guides: [
      { type: GuideLineType.VERTICAL, position: 198.5, color: '#8b5cf6', visible: true },
      { type: GuideLineType.VERTICAL, position: 397, color: '#8b5cf6', visible: true },
      { type: GuideLineType.VERTICAL, position: 595.5, color: '#8b5cf6', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 280.75, color: '#8b5cf6', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 561.5, color: '#8b5cf6', visible: true },
      { type: GuideLineType.HORIZONTAL, position: 842.25, color: '#8b5cf6', visible: true },
    ],
  },
]

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
  guides: GuideLine[]
  showGuides: boolean
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
  customComponents: CustomComponent[]
}

// 自定义组件
export interface CustomComponent {
  id: string
  name: string
  components: CanvasComponent[]
  createdAt: number
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
