import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ContentModule } from './content/content.module'
import { AuditModule } from './audit/audit.module'
import { AIModule } from './ai/ai.module'
import { ProxyModule } from './proxy/proxy.module'
import { GEOModule } from './geo/geo.module'

@Module({
  imports: [ContentModule, AuditModule, AIModule, ProxyModule, GEOModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
