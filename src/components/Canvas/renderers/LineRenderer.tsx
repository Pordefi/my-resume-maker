import { Line } from 'react-konva'
import { LineComponent } from '@/types/canvas'

interface Props {
  component: LineComponent
}

const LineRenderer = ({ component }: Props) => {
  // 计算线条的边界框，用于提供更大的点击区域
  const hitStrokeWidth = Math.max(component.strokeWidth, 10) // 至少10px的点击区域
  
  return (
    <>
      {/* 不可见的更宽的线条用于点击检测 */}
      <Line
        points={component.points}
        stroke="transparent"
        strokeWidth={hitStrokeWidth}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={hitStrokeWidth}
      />
      {/* 实际可见的线条 */}
      <Line
        points={component.points}
        stroke={component.stroke}
        strokeWidth={component.strokeWidth}
        dash={component.dash}
        lineCap="round"
        lineJoin="round"
        listening={false}
      />
    </>
  )
}

export default LineRenderer
