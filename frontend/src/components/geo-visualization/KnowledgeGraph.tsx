import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import MetricsRadar from './MetricsRadar'
import type { APINode, APIEdge } from '@/types/geo'

interface KnowledgeGraphProps {
    nodes: APINode[]
    edges: APIEdge[]
    onNodeClick?: (node: APINode) => void
    onEdgeClick?: (edge: APIEdge) => void
}

const METRICS_INFO = {
    'Content Score': {
        title: 'Overall AI Perception',
        description: 'How well your content is likely to be understood and used by AI models'
    },
    'Authority': {
        title: 'Source Authority',
        description: 'How credible and trustworthy the content appears to AI models'
    },
    'Relevance': {
        title: 'AI Relevance',
        description: 'How likely AI models are to use this content when answering related queries'
    },
    'Freshness': {
        title: 'Content Freshness',
        description: 'How current and up-to-date the content appears to AI models'
    }
}

export default function KnowledgeGraph({ nodes }: KnowledgeGraphProps) {
    // If no data, show placeholder
    if (!nodes?.length) {
        return (
            <Card>
                <CardContent className="h-[500px] flex items-center justify-center text-muted-foreground">
                    No analysis data available yet.
                </CardContent>
            </Card>
        )
    }

    // Get the main content node (should be the first one)
    const mainNode = nodes[0]

    // Prepare metrics for radar chart
    const metrics = {
        'Content Score': mainNode.score,
        'Authority': mainNode.metrics.authority,
        'Relevance': mainNode.metrics.relevance,
        'Freshness': mainNode.metrics.freshness
    }

    return (
        <div className="space-y-6">
            {/* Metrics Visualization */}
            <div className="h-[400px]">
                <MetricsRadar
                    title="AI Perception Metrics"
                    metrics={metrics}
                    maxValue={100}
                    showLegend={false}
                />
            </div>

            {/* Metrics Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(metrics).map(([key, value]) => (
                    <TooltipProvider key={key}>
                        <Tooltip>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{METRICS_INFO[key as keyof typeof METRICS_INFO].title}</span>
                                        <TooltipTrigger>
                                            <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
                                        </TooltipTrigger>
                                    </div>
                                    <span className="text-lg font-bold">{value}/100</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                            <TooltipContent>
                                <p className="max-w-xs">{METRICS_INFO[key as keyof typeof METRICS_INFO].description}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
        </div>
    )
}