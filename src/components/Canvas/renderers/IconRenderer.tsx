import { Text } from 'react-konva'
import { IconComponent } from '@/types/canvas'

interface Props {
  component: IconComponent
}

// 简单的图标渲染器，使用Unicode符号
const ICON_MAP: Record<string, string> = {
  star: '★',
  heart: '♥',
  circle: '●',
  square: '■',
  triangle: '▲',
  phone: '☎',
  email: '✉',
  location: '📍',
  link: '🔗',
  check: '✓',
}

const IconRenderer = ({ component }: Props) => {
  const icon = ICON_MAP[component.iconName] || '●'

  return (
    <Text
      text={icon}
      fontSize={component.width}
      fill={component.color}
      width={component.width}
      height={component.height}
      align="center"
      verticalAlign="middle"
    />
  )
}

export default IconRenderer
