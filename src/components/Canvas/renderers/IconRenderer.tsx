import { Path, Group } from 'react-konva'
import { IconComponent } from '@/types/canvas'
import { ICON_LIBRARY } from '@/utils/icons'

interface Props {
  component: IconComponent
}

const IconRenderer = ({ component }: Props) => {
  const iconDef = ICON_LIBRARY.find(i => i.id === component.iconName)
  
  if (!iconDef) {
    // 如果找不到图标定义，显示一个默认圆形
    return (
      <Group>
        <Path
          data="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
          fill={component.color}
          scaleX={component.width / 24}
          scaleY={component.height / 24}
        />
      </Group>
    )
  }

  // 从SVG字符串中提取path的d属性
  const pathMatch = iconDef.svg.match(/d="([^"]+)"/)
  const pathData = pathMatch ? pathMatch[1] : ''

  return (
    <Group>
      <Path
        data={pathData}
        fill={component.color}
        scaleX={component.width / 24}
        scaleY={component.height / 24}
      />
    </Group>
  )
}

export default IconRenderer
