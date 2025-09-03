import { Controller, Post, Body, Logger, BadRequestException } from '@nestjs/common'
import { AnalyzeContentUseCase } from '../../application/use-cases/analyze-content.use-case'
import { GetRecommendationsUseCase } from '../../application/use-cases/get-recommendations.use-case'
import { AnalyzeContentRequestDto, GEOAnalysisResponseDto } from '../../application/dto/geo-analysis.dto'
import { RecommendationsResponseDto } from '../../application/use-cases/get-recommendations.use-case'

@Controller('geo')
export class GEOController {
    private readonly logger = new Logger(GEOController.name)

    constructor(
        private readonly analyzeContentUseCase: AnalyzeContentUseCase,
        private readonly getRecommendationsUseCase: GetRecommendationsUseCase
    ) { }

    @Post('analyze')
    async analyzeContent(@Body() request: AnalyzeContentRequestDto): Promise<GEOAnalysisResponseDto> {
        this.logger.log(`Analyzing ${request.contentType} content`)

        try {
            return await this.analyzeContentUseCase.execute(request)
        } catch (error) {
            this.logger.error(`Analysis failed: ${error.message}`, error.stack)

            if (error instanceof BadRequestException) {
                throw error
            }

            throw new BadRequestException(`Failed to analyze content: ${error.message}`)
        }
    }

    @Post('recommendations')
    async getRecommendations(@Body() request: AnalyzeContentRequestDto): Promise<RecommendationsResponseDto> {
        this.logger.log(`Getting recommendations for ${request.contentType}`)

        try {
            return await this.getRecommendationsUseCase.execute(request)
        } catch (error) {
            this.logger.error(`Recommendations failed: ${error.message}`, error.stack)
            throw new BadRequestException(`Failed to get recommendations: ${error.message}`)
        }
    }

    @Post('citation-potential')
    async analyzeCitationPotential(@Body() request: AnalyzeContentRequestDto): Promise<{
        likelihood: number
        category: string
        quotableElements: string[]
        contexts: string[]
    }> {
        this.logger.log(`Analyzing citation potential for ${request.contentType}`)

        try {
            const analysis = await this.analyzeContentUseCase.execute(request)

            return {
                likelihood: analysis.citationAnalysis.likelihood,
                category: analysis.citationAnalysis.likelihood >= 80 ? 'High' :
                    analysis.citationAnalysis.likelihood >= 60 ? 'Medium' : 'Low',
                quotableElements: analysis.citationAnalysis.quotableElements,
                contexts: analysis.citationAnalysis.citationContexts
            }
        } catch (error) {
            this.logger.error(`Citation analysis failed: ${error.message}`, error.stack)
            throw new BadRequestException(`Failed to analyze citation potential: ${error.message}`)
        }
    }
}
