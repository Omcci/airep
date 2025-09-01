import { FunctionComponent } from 'react'

declare module 'recharts' {
    export interface PolarAngleAxisProps {
        dataKey?: string | number | ((obj: any) => any)
        tick?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        tickLine?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        axisLine?: boolean | object
        orient?: 'inner' | 'outer'
        type?: 'number' | 'category'
        allowDuplicatedCategory?: boolean
    }

    export interface PolarRadiusAxisProps {
        angle?: number
        domain?: [number, number] | [(dataMin: number) => number, (dataMax: number) => number]
        tick?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        tickLine?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        axisLine?: boolean | object
        orient?: 'left' | 'right' | 'middle'
        type?: 'number' | 'category'
    }

    export interface RadarProps {
        dataKey: string | number | ((obj: any) => any)
        name?: string
        stroke?: string
        fill?: string
        fillOpacity?: number
        legendType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye' | 'none'
        dot?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        label?: boolean | object | React.ReactElement | ((props: any) => React.ReactElement)
        isAnimationActive?: boolean
        animationBegin?: number
        animationDuration?: number
        animationEasing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    }

    export interface LegendProps {
        align?: 'left' | 'center' | 'right'
        verticalAlign?: 'top' | 'middle' | 'bottom'
        layout?: 'horizontal' | 'vertical'
        iconSize?: number
        iconType?: 'line' | 'square' | 'rect' | 'circle' | 'cross' | 'diamond' | 'star' | 'triangle' | 'wye'
        formatter?: (value: any, entry: any) => React.ReactNode
        payload?: Array<{
            value: any
            type: string
            color: string
            payload: any
        }>
    }

    export const PolarAngleAxis: FunctionComponent<PolarAngleAxisProps>
    export const PolarRadiusAxis: FunctionComponent<PolarRadiusAxisProps>
    export const Radar: FunctionComponent<RadarProps>
    export const Legend: FunctionComponent<LegendProps>
}
