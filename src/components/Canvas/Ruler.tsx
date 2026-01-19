import { useCanvasStore } from '@/store/canvasStore'

interface RulerProps {
  type: 'horizontal' | 'vertical'
  zoom: number
}

const Ruler = ({ type, zoom }: RulerProps) => {
  const { canvasWidth, canvasHeight } = useCanvasStore()
  
  const rulerSize = 20 // 标尺宽度/高度
  const length = type === 'horizontal' ? canvasWidth : canvasHeight
  const step = 50 // 每50px一个刻度
  const largeStep = 100 // 每100px一个大刻度

  const ticks = []
  for (let i = 0; i <= length; i += step) {
    const isLarge = i % largeStep === 0
    ticks.push({
      position: i,
      isLarge,
      label: isLarge ? i.toString() : null,
    })
  }

  if (type === 'horizontal') {
    return (
      <div
        className="absolute top-0 left-0 bg-gray-200 border-b border-gray-300 overflow-hidden"
        style={{
          width: canvasWidth * zoom,
          height: rulerSize,
          marginLeft: rulerSize,
        }}
      >
        <svg
          width={canvasWidth * zoom}
          height={rulerSize}
          style={{ display: 'block' }}
        >
          {ticks.map((tick, index) => (
            <g key={index}>
              <line
                x1={tick.position * zoom}
                y1={rulerSize - (tick.isLarge ? 8 : 4)}
                x2={tick.position * zoom}
                y2={rulerSize}
                stroke="#666"
                strokeWidth="1"
              />
              {tick.label && (
                <text
                  x={tick.position * zoom + 2}
                  y={rulerSize - 10}
                  fontSize="10"
                  fill="#666"
                  fontFamily="monospace"
                >
                  {tick.label}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    )
  }

  // Vertical ruler
  return (
    <div
      className="absolute top-0 left-0 bg-gray-200 border-r border-gray-300 overflow-hidden"
      style={{
        width: rulerSize,
        height: canvasHeight * zoom,
        marginTop: rulerSize,
      }}
    >
      <svg
        width={rulerSize}
        height={canvasHeight * zoom}
        style={{ display: 'block' }}
      >
        {ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={rulerSize - (tick.isLarge ? 8 : 4)}
              y1={tick.position * zoom}
              x2={rulerSize}
              y2={tick.position * zoom}
              stroke="#666"
              strokeWidth="1"
            />
            {tick.label && (
              <text
                x={2}
                y={tick.position * zoom + 12}
                fontSize="10"
                fill="#666"
                fontFamily="monospace"
                transform={`rotate(-90 ${rulerSize / 2} ${tick.position * zoom})`}
              >
                {tick.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export default Ruler
