declare module 'react-force-graph-3d' {
    import { Component, RefObject } from 'react'

    interface GraphData {
        nodes: any[]
        links: any[]
    }

    export interface ForceGraphMethods {
        // Common methods
        refresh(): void
        pauseAnimation(): void
        resumeAnimation(): void
        centerAt(x?: number, y?: number, ms?: number): void
        zoom(k?: number, ms?: number): void
        zoomToFit(ms?: number, padding?: number): void
        // Add other methods as needed
    }

    interface ForceGraphProps {
        graphData: GraphData
        nodeLabel?: string | ((node: any) => string)
        nodeColor?: string | ((node: any) => string)
        nodeVal?: number | ((node: any) => number)
        nodeRelSize?: number
        nodeOpacity?: number
        nodeResolution?: number
        linkSource?: string
        linkTarget?: string
        linkLabel?: string | ((link: any) => string)
        linkColor?: string | ((link: any) => string)
        linkWidth?: number | ((link: any) => number)
        linkOpacity?: number
        linkResolution?: number
        linkDirectionalParticles?: number | ((link: any) => number)
        linkDirectionalParticleSpeed?: number | ((link: any) => number)
        linkDirectionalParticleWidth?: number | ((link: any) => number)
        linkDirectionalParticleColor?: string | ((link: any) => string)
        backgroundColor?: string
        showNavInfo?: boolean
        nodeThreeObject?: ((node: any) => any) | null
        nodeThreeObjectExtend?: boolean
        linkThreeObject?: ((link: any) => any) | null
        linkThreeObjectExtend?: boolean
        onNodeClick?: (node: any, event: MouseEvent) => void
        onNodeRightClick?: (node: any, event: MouseEvent) => void
        onNodeHover?: (node: any | null, previousNode: any | null) => void
        onLinkClick?: (link: any, event: MouseEvent) => void
        onLinkRightClick?: (link: any, event: MouseEvent) => void
        onLinkHover?: (link: any | null, previousLink: any | null) => void
        onBackgroundClick?: (event: MouseEvent) => void
        onBackgroundRightClick?: (event: MouseEvent) => void
        ref?: RefObject<ForceGraphMethods>
    }

    export default class ForceGraph3D extends Component<ForceGraphProps> implements ForceGraphMethods {
        refresh(): void
        pauseAnimation(): void
        resumeAnimation(): void
        centerAt(x?: number, y?: number, ms?: number): void
        zoom(k?: number, ms?: number): void
        zoomToFit(ms?: number, padding?: number): void
    }
}