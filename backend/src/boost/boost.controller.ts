import { Body, Controller, Post } from '@nestjs/common'
import { BoostService } from './boost.service'

@Controller('boost')
export class BoostController {
    constructor(private readonly boost: BoostService) { }

    @Post('tool')
    tool(@Body() body: any) {
        return this.boost.generateToolBoost(body)
    }

    @Post('article')
    article(@Body() body: any) {
        return this.boost.generateArticleBoost(body)
    }
}
