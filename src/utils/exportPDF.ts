import jsPDF from 'jspdf'
import { Page } from '@/types/canvas'

// A4纸张尺寸（毫米）
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export const exportToPDF = async (
  canvasElement: HTMLElement,
  filename = 'resume.pdf',
  hideGuides?: () => void,
  showGuides?: () => void
) => {
  try {
    // 导出前隐藏辅助线
    if (hideGuides) hideGuides()
    
    // 等待DOM更新
    await new Promise((resolve) => setTimeout(resolve, 50))
    
    // 获取Konva Stage实例
    const stageContainer = canvasElement.querySelector('.konvajs-content')
    const canvas = stageContainer?.querySelector('canvas') as HTMLCanvasElement
    
    if (!canvas) {
      throw new Error('未找到画布元素')
    }
    
    // 直接使用canvas的toDataURL，保持原始分辨率
    // 使用高质量PNG格式，避免JPEG压缩损失
    const imgData = canvas.toDataURL('image/png')
    
    // 创建PDF (A4尺寸)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // 禁用压缩以保持清晰度
    })

    // 使用PNG格式添加图片，保持原始质量
    pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'NONE')
    pdf.save(filename)
    
    // 恢复辅助线显示
    if (showGuides) showGuides()
    
    return true
  } catch (error) {
    console.error('PDF导出失败:', error)
    // 确保恢复辅助线显示
    if (showGuides) showGuides()
    throw error
  }
}

// 多页面PDF导出
export const exportMultiPageToPDF = async (
  pages: Page[],
  selectedPageIds: string[],
  renderPage: (page: Page) => Promise<HTMLElement>,
  filename = 'resume.pdf',
  hideGuides?: () => void,
  showGuides?: () => void
) => {
  try {
    // 导出前隐藏辅助线
    if (hideGuides) hideGuides()
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: false, // 禁用压缩以保持清晰度
    })

    const pagesToExport = pages.filter((p) => selectedPageIds.includes(p.id))

    for (let i = 0; i < pagesToExport.length; i++) {
      const page = pagesToExport[i]
      const canvasElement = await renderPage(page)

      // 等待DOM更新
      await new Promise((resolve) => setTimeout(resolve, 100))

      // 获取Konva Stage实例
      const stageContainer = canvasElement.querySelector('.konvajs-content')
      const canvas = stageContainer?.querySelector('canvas') as HTMLCanvasElement
      
      if (!canvas) {
        console.error('未找到画布元素')
        continue
      }

      // 直接使用canvas的toDataURL，保持原始分辨率
      const imgData = canvas.toDataURL('image/png')

      if (i > 0) {
        pdf.addPage()
      }

      // 使用PNG格式添加图片，保持原始质量
      pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, 'NONE')
    }

    pdf.save(filename)
    
    // 恢复辅助线显示
    if (showGuides) showGuides()
    
    return true
  } catch (error) {
    console.error('多页面PDF导出失败:', error)
    // 确保恢复辅助线显示
    if (showGuides) showGuides()
    throw error
  }
}

export const exportToImage = async (
  canvasElement: HTMLElement,
  filename = 'resume.png',
  hideGuides?: () => void,
  showGuides?: () => void
) => {
  try {
    // 导出前隐藏辅助线
    if (hideGuides) hideGuides()
    
    // 等待DOM更新
    await new Promise((resolve) => setTimeout(resolve, 50))
    
    // 获取Konva Stage实例
    const stageContainer = canvasElement.querySelector('.konvajs-content')
    const canvas = stageContainer?.querySelector('canvas') as HTMLCanvasElement
    
    if (!canvas) {
      throw new Error('未找到画布元素')
    }

    // 根据文件扩展名决定格式
    const isPNG = filename.toLowerCase().endsWith('.png')
    const mimeType = isPNG ? 'image/png' : 'image/jpeg'
    const quality = isPNG ? undefined : 0.98 // JPEG使用高质量

    canvas.toBlob((blob) => {
      if (!blob) throw new Error('生成图片失败')
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    }, mimeType, quality)
    
    // 恢复辅助线显示
    if (showGuides) showGuides()
    
    return true
  } catch (error) {
    console.error('图片导出失败:', error)
    // 确保恢复辅助线显示
    if (showGuides) showGuides()
    throw error
  }
}
