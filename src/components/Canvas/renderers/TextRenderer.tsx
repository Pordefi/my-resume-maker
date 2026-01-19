import { Text } from 'react-konva'
import { TextComponent } from '@/types/canvas'

interface Props {
  component: TextComponent
}

const TextRenderer = ({ component }: Props) => {
  return (
    <Text
      text={component.text}
      fontSize={component.fontSize}
      fontFamily={component.fontFamily}
      fontStyle={`${component.fontStyle} ${component.fontWeight}`}
      fill={component.color}
      align={component.textAlign}
      width={component.width}
      height={component.height}
      lineHeight={component.lineHeight}
      letterSpacing={component.letterSpacing}
      wrap="word"
    />
  )
}

export default TextRenderer
