import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
    constructor(private readonly proxyService: ProxyService) { }

    @Get('fetch-content')
    async fetchContent(@Query('url') url: string) {
        if (!url) {
            throw new HttpException('URL is required', HttpStatus.BAD_REQUEST);
        }

        try {
            const content = await this.proxyService.fetchContent(url);
            return { content };
        } catch (error) {
            throw new HttpException(
                'Failed to fetch content: ' + error.message,
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
