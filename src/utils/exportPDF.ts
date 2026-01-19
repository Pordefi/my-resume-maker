import jsPDF from 'jspdf'
import { Page } from '@/types/canvas'
import Konva from 'konva'

// A4纸张尺寸（毫米）
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export const exportToPDF = async (
  stageRef: React.RefObject<Konva.Stage>,
  filename = 'resume.pdf',
  hideGuides?: () => void,
  showGuides?: () => void
) => {
  try {
    // 导出前隐藏辅助线
    if (hideGuides) hideGuides()
    
    // 等待DOM更新
    await new Promise((resolve) => setTimeout(resolve, 50))
    
    const stage = stageRef.current
    if (!stage) {
      throw new Error('未找到画布Stage')
    }
    
    // 使用Konva Stage的toDataURL方法，保持原始分辨率
    // pixelRatio设置为2以获得更高清晰度
    const imgData = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 2, // 2倍分辨率，更清晰
    })
    
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
  getStageRef: () => React.RefObject<Konva.Stage>,
  renderPage: (page: Page) => Promise<void>,
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
      
      // 切换到目标页面
      await renderPage(page)

      // 等待DOM更新和渲染完成
      await new Promise((resolve) => setTimeout(resolve, 200))

      const stageRef = getStageRef()
      const stage = stageRef.current
      
      if (!stage) {
        console.error('未找到画布Stage')
        continue
      }

      // 使用Konva Stage的toDataURL方法
      const imgData = stage.toDataURL({
        mimeType: 'image/png',
        quality: 1,
        pixelRatio: 2, // 2倍分辨率，更清晰
      })

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
  stageRef: React.RefObject<Konva.Stage>,
  filename = 'resume.png',
  hideGuides?: () => void,
  showGuides?: () => void
) => {
  try {
    // 导出前隐藏辅助线
    if (hideGuides) hideGuides()
    
    // 等待DOM更新
    await new Promise((resolve) => setTimeout(resolve, 50))
    
    const stage = stageRef.current
    if (!stage) {
      throw new Error('未找到画布Stage')
    }

    // 根据文件扩展名决定格式
    const isPNG = filename.toLowerCase().endsWith('.png')
    const mimeType = isPNG ? 'image/png' : 'image/jpeg'
    const quality = isPNG ? 1 : 0.98 // PNG使用最高质量

    // 使用Konva Stage的toDataURL方法
    const dataURL = stage.toDataURL({
      mimeType: mimeType,
      quality: quality,
      pixelRatio: 2, // 2倍分辨率，更清晰
    })

    // 下载图片
    const link = document.createElement('a')
    link.href = dataURL
    link.download = filename
    link.click()
    
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
