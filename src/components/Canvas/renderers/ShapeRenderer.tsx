import { Rect, Circle, Ellipse, Text, Group } from 'react-konva'
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

  const renderShape = () => {
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

  return (
    <Group>
      {renderShape()}
      {component.text && (
        <Text
          text={component.text}
          fontSize={component.fontSize || 16}
          fontFamily={component.fontFamily || 'Arial, sans-serif'}
          fontStyle={component.fontWeight || 'normal'}
          fill={component.textColor || '#000000'}
          align={component.textAlign || 'center'}
          verticalAlign="middle"
          width={component.width}
          height={component.height}
        />
      )}
    </Group>
  )
}

export default ShapeRenderer
