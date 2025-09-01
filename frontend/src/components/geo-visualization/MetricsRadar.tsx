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
            text: '#1e293b'
        },
        dark: {
            stroke: '#3b82f6',
            fill: '#2563eb',
            grid: '#334155',
            text: '#e2e8f0'
        }
    }

    const currentColors = colors[theme === 'dark' ? 'dark' : 'light']

    return (
        <div className="rounded-xl bg-card text-card-foreground shadow">
            <div className="flex flex-col space-y-1.5 p-6">
                <div className="font-semibold leading-none tracking-tight">{title}</div>
            </div>
            <div className="p-6 pt-0 h-[400px]">
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