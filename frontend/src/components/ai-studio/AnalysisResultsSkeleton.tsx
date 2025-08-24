import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AnalysisResultsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    📊 Analysis Results
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Score Display Skeleton */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="h-12 w-20 bg-muted rounded animate-pulse"></div>
                        <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                    </div>
                    <div className="h-4 w-32 bg-muted rounded animate-pulse mx-auto"></div>
                </div>

                {/* Score Breakdown Skeleton */}
                <div className="space-y-4">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm items-center">
                                    <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                    <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Insights and Recommendations Skeleton */}
                <div className="mt-6">
                    <div className="h-4 w-64 bg-muted rounded animate-pulse mb-4"></div>
                    
                    <div className="space-y-6">
                        {/* Insights Skeleton */}
                        <div className="space-y-3">
                            <div className="border-b pb-2">
                                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                                <div className="h-3 w-48 bg-muted rounded animate-pulse mt-1"></div>
                            </div>
                            
                            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <thead className="bg-muted/50 border-b border-border">
                                        <tr>
                                            <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                #
                                            </th>
                                            <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                Insight
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <tr key={i} className="border-b border-border last:border-b-0">
                                                <td className="p-4">
                                                    <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recommendations Skeleton */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <div className="h-4 w-40 bg-muted rounded animate-pulse"></div>
                                <div className="h-3 w-56 bg-muted rounded animate-pulse mt-1"></div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="p-4 bg-card border border-border rounded-lg shadow-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 bg-muted rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-3 w-16 bg-muted rounded animate-pulse mb-2"></div>
                                                <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
