import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageOrientation,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  HeadingLevel,
  UnderlineType,
} from 'docx'
import { saveAs } from 'file-saver'
import { Page, CanvasComponent, ComponentType, TextComponent, ShapeComponent, LineComponent } from '@/types/canvas'

// 将像素转换为EMU（English Metric Units）
const pixelToEMU = (pixel: number): number => {
  return Math.round(pixel * 9525)
}

// 将像素转换为DXA（Twips）
const pixelToDXA = (pixel: number): number => {
  return Math.round(pixel * 15)
}

// 将颜色转换为Word格式（去掉#）
const convertColor = (color: string): string => {
  return color.replace('#', '')
}

// 将组件转换为Word段落
const componentToParagraph = (component: CanvasComponent): Paragraph | null => {
  if (component.type === ComponentType.TEXT) {
    const textComp = component as TextComponent
    
    // 确定对齐方式
    let alignment = AlignmentType.LEFT
    if (textComp.align === 'center') alignment = AlignmentType.CENTER
    if (textComp.align === 'right') alignment = AlignmentType.RIGHT
    
    // 创建文本运行
    const textRun = new TextRun({
      text: textComp.text,
      size: textComp.fontSize * 2, // Word使用半点
      font: textComp.fontFamily,
      color: convertColor(textComp.color),
      bold: textComp.fontWeight === 'bold',
      italics: textComp.fontStyle === 'italic',
      underline: textComp.textDecoration === 'underline' ? { type: UnderlineType.SINGLE } : undefined,
    })
    
    return new Paragraph({
      children: [textRun],
      alignment,
      spacing: {
        before: pixelToDXA(textComp.y),
        after: pixelToDXA(textComp.lineHeight * textComp.fontSize),
      },
    })
  }
  
  return null
}

// 将组件按Y坐标排序并分组
const groupComponentsByPosition = (components: CanvasComponent[]): CanvasComponent[][] => {
  // 按Y坐标排序
  const sorted = [...components].sort((a, b) => a.y - b.y)
  
  // 分组：Y坐标相近的组件视为同一行
  const groups: CanvasComponent[][] = []
  let currentGroup: CanvasComponent[] = []
  let lastY = -1
  const threshold = 20 // Y坐标差异阈值
  
  sorted.forEach((comp) => {
    if (lastY === -1 || Math.abs(comp.y - lastY) < threshold) {
      currentGroup.push(comp)
      lastY = comp.y
    } else {
      if (currentGroup.length > 0) {
        groups.push([...currentGroup])
      }
      currentGroup = [comp]
      lastY = comp.y
    }
  })
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }
  
  return groups
}

// 将页面组件转换为Word段落数组
const pageToWordElements = (page: Page): Paragraph[] => {
  const paragraphs: Paragraph[] = []
  
  // 按位置分组组件
  const groups = groupComponentsByPosition(page.components)
  
  groups.forEach((group) => {
    // 按X坐标排序同一行的组件
    const sortedGroup = group.sort((a, b) => a.x - b.x)
    
    // 处理每个组件
    sortedGroup.forEach((component) => {
      if (component.type === ComponentType.TEXT) {
        const textComp = component as TextComponent
        
        // 确定对齐方式
        let alignment = AlignmentType.LEFT
        if (textComp.align === 'center') alignment = AlignmentType.CENTER
        if (textComp.align === 'right') alignment = AlignmentType.RIGHT
        
        // 确定标题级别（根据字体大小）
        let heading: HeadingLevel | undefined
        if (textComp.fontSize >= 24) heading = HeadingLevel.HEADING_1
        else if (textComp.fontSize >= 20) heading = HeadingLevel.HEADING_2
        else if (textComp.fontSize >= 16) heading = HeadingLevel.HEADING_3
        
        // 创建文本运行
        const textRun = new TextRun({
          text: textComp.text,
          size: textComp.fontSize * 2,
          font: textComp.fontFamily,
          color: convertColor(textComp.color),
          bold: textComp.fontWeight === 'bold',
          italics: textComp.fontStyle === 'italic',
          underline: textComp.textDecoration === 'underline' ? { type: UnderlineType.SINGLE } : undefined,
        })
        
        paragraphs.push(
          new Paragraph({
            children: [textRun],
            alignment,
            heading,
            spacing: {
              before: 100,
              after: 100,
              line: Math.round(textComp.lineHeight * 240),
            },
          })
        )
      } else if (component.type === ComponentType.LINE) {
        // 线条转换为边框或分隔符
        const lineComp = component as LineComponent
        
        paragraphs.push(
          new Paragraph({
            children: [],
            border: {
              bottom: {
                color: convertColor(lineComp.stroke),
                space: 1,
                style: lineComp.dash && lineComp.dash.length > 0 ? BorderStyle.DASHED : BorderStyle.SINGLE,
                size: lineComp.strokeWidth * 8,
              },
            },
            spacing: {
              before: 100,
              after: 100,
            },
          })
        )
      } else if (component.type === ComponentType.SHAPE) {
        // 形状转换为带背景色的段落
        const shapeComp = component as ShapeComponent
        
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: ' ', // 空格占位
              }),
            ],
            shading: {
              fill: convertColor(shapeComp.fill),
            },
            spacing: {
              before: 100,
              after: 100,
            },
          })
        )
      }
    })
    
    // 添加行间距
    paragraphs.push(
      new Paragraph({
        children: [],
        spacing: {
          before: 50,
          after: 50,
        },
      })
    )
  })
  
  return paragraphs
}

// 导出单页Word文档
export const exportToWord = async (
  page: Page,
  filename = 'resume.docx'
) => {
  try {
    // 转换组件为Word元素
    const paragraphs = pageToWordElements(page)
    
    // 创建Word文档
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              size: {
                orientation: PageOrientation.PORTRAIT,
                width: 11906, // A4宽度
                height: 16838, // A4高度
              },
              margin: {
                top: 1440, // 1英寸 = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    })
    
    // 生成并下载Word文档
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, filename)
    
    return true
  } catch (error) {
    console.error('Word导出失败:', error)
    throw error
  }
}

// 导出多页Word文档
export const exportMultiPageToWord = async (
  pages: Page[],
  selectedPageIds: string[],
  filename = 'resume.docx'
) => {
  try {
    const pagesToExport = pages.filter((p) => selectedPageIds.includes(p.id))
    const sections = []
    
    for (const page of pagesToExport) {
      const paragraphs = pageToWordElements(page)
      
      sections.push({
        properties: {
          page: {
            size: {
              orientation: PageOrientation.PORTRAIT,
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      })
    }
    
    // 创建Word文档
    const doc = new Document({
      sections,
    })
    
    // 生成并下载Word文档
    const buffer = await Packer.toBlob(doc)
    saveAs(buffer, filename)
    
    return true
  } catch (error) {
    console.error('多页面Word导出失败:', error)
    throw error
  }
}

