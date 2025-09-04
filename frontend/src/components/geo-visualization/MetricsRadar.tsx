import { useCallback } from 'react'
import { useTheme } from '@/components/theme-provider'
import RadarChartWrapper from './RadarChartWrapper'

interface MetricsData {
    [key: string]: number
}

interface MetricsRadarProps {
    title: string
    metrics: MetricsData
    maxValue?: number
    showLegend?: boolean
}

export default function MetricsRadar({ title, metrics, maxValue = 100, showLegend = false }: MetricsRadarProps) {
    const { theme } = useTheme()

    // Transform metrics for radar chart
    const data = useCallback(() =>
        Object.entries(metrics).map(([key, value]) => ({
            subject: key.replace(/([A-Z])/g, ' $1').trim(), // Add spaces before capital letters
            value,
            fullMark: maxValue
        }))
        , [metrics, maxValue])

    // Theme-aware colors
    const colors = {
        light: {
            stroke: '#2563eb',
            fill: '#3b82f6',
            grid: '#e2e8f0',
            text: '#64748b'
        },
        dark: {
            stroke: '#60a5fa',
            fill: '#3b82f6',
            grid: '#334155',
            text: '#94a3b8'
        }
    }

    const currentColors = colors[theme === 'dark' ? 'dark' : 'light']

    return (
        <div className="rounded-xl bg-card text-card-foreground">
            <div className="flex flex-col space-y-1.5 p-4">
                <div className="text-sm font-medium text-muted-foreground">{title}</div>
            </div>
            <div className="p-4 pt-0 h-[500px]">
                <RadarChartWrapper
                    data={data()}
                    colors={currentColors}
                    maxValue={maxValue}
                    showLegend={showLegend}
                />
            </div>
        </div>
    )
}