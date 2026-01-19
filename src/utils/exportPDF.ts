import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Page } from '@/types/canvas'

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
    
    // 使用html2canvas捕获画布
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    
    // 创建PDF (A4尺寸)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
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
    })

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    const pagesToExport = pages.filter((p) => selectedPageIds.includes(p.id))

    for (let i = 0; i < pagesToExport.length; i++) {
      const page = pagesToExport[i]
      const canvasElement = await renderPage(page)

      // 等待DOM更新
      await new Promise((resolve) => setTimeout(resolve, 50))

      const canvas = await html2canvas(canvasElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: page.backgroundColor,
      })

      const imgData = canvas.toDataURL('image/png')

      if (i > 0) {
        pdf.addPage()
      }

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
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
    
    const canvas = await html2canvas(canvasElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })

    canvas.toBlob((blob) => {
      if (!blob) throw new Error('生成图片失败')
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    })
    
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
