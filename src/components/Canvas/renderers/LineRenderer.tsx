import { Line } from 'react-konva'
import { LineComponent } from '@/types/canvas'

interface Props {
  component: LineComponent
}

const LineRenderer = ({ component }: Props) => {
  return (
    <Line
      points={component.points}
      stroke={component.stroke}
      strokeWidth={component.strokeWidth}
      dash={component.dash}
      lineCap="round"
      lineJoin="round"
    />
  )
}

export default LineRenderer
