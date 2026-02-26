import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIAnalysisRequestDto } from './dto/ai-analysis.dto';

@Controller('ai')
export class AITestController {
  constructor(private readonly aiService: AIService) {}

  @Get('status')
  getProviderStatus() {
    return this.aiService.getProviderStatus();
  }

  @Get('providers')
  getAvailableProviders() {
    return this.aiService.getAvailableProviders();
  }

  @Post('analyze')
  async analyze(@Body() dto: AIAnalysisRequestDto) {
    return this.aiService.analyzeContent(dto);
  }

  @Get('cost')
  async getEstimatedCost(
    @Query('content') content: string,
    @Query('platform') platform: string,
  ) {
    return this.aiService.getEstimatedCost(content, platform);
  }
}
