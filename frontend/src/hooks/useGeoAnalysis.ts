import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { GEOAnalysisData } from '@/types/geo'

export function useGeoAnalysis(content: string, contentType: string, isUrl: boolean = false) {
    return useQuery<GEOAnalysisData>({
        queryKey: ['geoAnalysis', content, contentType, isUrl],
        queryFn: async () => {
            if (!content) return null

            try {
                let analysisContent = content
                // For URLs, fetch the content first
                if (isUrl) {
                    const response = await fetch(`/api/proxy/fetch-content?url=${encodeURIComponent(content)}`)
                    if (!response.ok) {
                        throw new Error('Failed to fetch article content')
                    }
                    const data = await response.json()
                    analysisContent = data.content
                }

                // Now analyze the actual content
                const response = await api.geoAnalyze({
                    content: analysisContent,
                    contentType
                })

                // Validate essential data
                if (!response || !response.citationAnalysis || !response.knowledgeGraph) {
                    throw new Error('Invalid GEO analysis response structure')
                }

                return response
            } catch (error: unknown) {
                console.error('GEO Analysis failed:', error)
                if (error instanceof Error) {
                    if (isUrl && error.message.includes('fetch')) {
                        throw new Error('Failed to fetch article content. Please try copying the content directly.')
                    }
                    throw error
                }
                throw new Error('Failed to analyze content')
            }
        },
        enabled: !!content,
        retry: (failureCount, error) => {
            // Don't retry URL fetching errors
            if (error.message.includes('fetch')) return false
            // Retry other errors up to 2 times
            return failureCount < 2
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    })
}