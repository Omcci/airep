import { Controller, Post, Body, Logger } from '@nestjs/common'
import { AIGEOService } from './ai-geo.service'
import { GEOAnalysisRequestDto } from './dto/geo-analysis.dto'

@Controller('ai-geo')
export class AIGEOController {
    private readonly logger = new Logger(AIGEOController.name)

    constructor(private readonly geoService: AIGEOService) { }

    @Post('analyze')
    async analyzeGEO(@Body() request: GEOAnalysisRequestDto) {
        this.logger.log(`Analyzing GEO for ${request.contentType}`)
        return this.geoService.analyzeGEO(
            request.content,
            request.contentType
        )
    }

    @Post('recommendations')
    async getRecommendations(@Body() request: GEOAnalysisRequestDto) {
        this.logger.log(`Getting GEO recommendations for ${request.contentType}`)
        return this.geoService.getGEORecommendations(
            request.content,
            request.contentType
        )
    }

    @Post('citation-potential')
    async analyzeCitationPotential(@Body() request: GEOAnalysisRequestDto) {
        this.logger.log(`Analyzing citation potential for ${request.contentType}`)
        return this.geoService.analyzeCitationPotential(
            request.content,
            request.contentType
        )
    }
}
