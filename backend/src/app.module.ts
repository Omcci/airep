import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ContentModule } from './content/content.module'
import { AuditModule } from './audit/audit.module'

@Module({
  imports: [ContentModule, AuditModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
