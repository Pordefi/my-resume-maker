import { Rect, Circle, Ellipse } from 'react-konva'
import { ShapeComponent, ShapeType } from '@/types/canvas'

interface Props {
  component: ShapeComponent
}

const ShapeRenderer = ({ component }: Props) => {
  const commonProps = {
    fill: component.fill,
    stroke: component.stroke,
    strokeWidth: component.strokeWidth,
    opacity: component.opacity,
  }

  switch (component.shapeType) {
    case ShapeType.RECTANGLE:
      return (
        <Rect
          {...commonProps}
          width={component.width}
          height={component.height}
          cornerRadius={component.borderRadius}
        />
      )

    case ShapeType.CIRCLE:
      return (
        <Circle
          {...commonProps}
          radius={Math.min(component.width, component.height) / 2}
          x={component.width / 2}
          y={component.height / 2}
        />
      )

    case ShapeType.ELLIPSE:
      return (
        <Ellipse
          {...commonProps}
          radiusX={component.width / 2}
          radiusY={component.height / 2}
          x={component.width / 2}
          y={component.height / 2}
        />
      )

    default:
      return null
  }
}

export default ShapeRenderer
