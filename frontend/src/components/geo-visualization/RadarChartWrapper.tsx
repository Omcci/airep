import { memo } from 'react'
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Legend,
    Tooltip,
    PolarAngleAxisProps,
    PolarRadiusAxisProps,
    RadarProps,
    LegendProps
} from 'recharts'

interface RadarChartProps {
    data: Array<{
        subject: string
        value: number
        fullMark: number
    }>
    colors: {
        stroke: string
        fill: string
        grid: string
        text: string
    }
    maxValue: number
    showLegend?: boolean
}

const RadarChartWrapper = memo(function RadarChartWrapper({ data, colors, maxValue, showLegend }: RadarChartProps) {
    // Configure components
    const angleAxisProps: PolarAngleAxisProps = {
        dataKey: "subject",
        tick: { fill: colors.text }
    }

    const radiusAxisProps: PolarRadiusAxisProps = {
        angle: 30,
        domain: [0, maxValue],
        tick: { fill: colors.text }
    }

    const radarProps: RadarProps = {
        name: "Metrics",
        dataKey: "value",
        stroke: colors.stroke,
        fill: colors.fill,
        fillOpacity: 0.3,
        strokeWidth: 2,
        dot: {
            fill: colors.stroke,
            strokeWidth: 0,
            r: 4
        },
        activeDot: {
            r: 6,
            strokeWidth: 0
        }
    }

    const legendProps: LegendProps = {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="85%" data={data}>
                <PolarGrid
                    stroke={colors.grid}
                    gridType="polygon"
                    gridCount={2} // This will create two polygons (at 50 and 100)
                    strokeDasharray="3 3"
                />
                <PolarAngleAxis {...angleAxisProps} tick={{ fontSize: 14 }} />
                <PolarRadiusAxis
                    {...radiusAxisProps}
                    axisLine={false}
                    tickCount={3} // This will create ticks at 0, 50, and 100
                    tick={(props) => {
                        // Only show 50 and 100
                        if (props.payload.value !== 50 && props.payload.value !== maxValue) {
                            return null;
                        }
                        return (
                            <text
                                x={props.x}
                                y={props.y}
                                fill={colors.text}
                                fontSize={12}
                                textAnchor={props.textAnchor}
                            >
                                {props.payload.value}
                            </text>
                        );
                    }}
                />
                <Radar {...radarProps} />
                {showLegend && <Legend {...legendProps} />}
                <Tooltip
                    contentStyle={{
                        backgroundColor: colors.text === '#e2e8f0' ? '#1e293b' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    labelStyle={{
                        color: colors.text === '#e2e8f0' ? '#e2e8f0' : '#1e293b',
                    }}
                />
            </RadarChart>
        </ResponsiveContainer>
    )
})

export default RadarChartWrapper