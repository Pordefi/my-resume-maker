import { Image as KonvaImage, Rect } from 'react-konva'
import { useEffect, useState } from 'react'
import { ImageComponent } from '@/types/canvas'

interface Props {
  component: ImageComponent
}

const ImageRenderer = ({ component }: Props) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  useEffect(() => {
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = component.src
    img.onload = () => setImage(img)
    img.onerror = () => setImage(null)
  }, [component.src])

  if (!image) {
    return (
      <Rect
        width={component.width}
        height={component.height}
        fill="#f3f4f6"
        stroke="#d1d5db"
        strokeWidth={1}
      />
    )
  }

  return (
    <KonvaImage
      image={image}
      width={component.width}
      height={component.height}
      opacity={component.opacity}
      cornerRadius={component.borderRadius}
    />
  )
}

export default ImageRenderer
