import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (canvasElement: HTMLElement, filename = 'resume.pdf') => {
  try {
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
    
    return true
  } catch (error) {
    console.error('PDF导出失败:', error)
    throw error
  }
}

export const exportToImage = async (canvasElement: HTMLElement, filename = 'resume.png') => {
  try {
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
    
    return true
  } catch (error) {
    console.error('图片导出失败:', error)
    throw error
  }
}
