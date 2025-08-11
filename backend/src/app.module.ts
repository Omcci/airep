import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ContentModule } from './content/content.module'
import { AuditModule } from './audit/audit.module'
import { BoostModule } from './boost/boost.module'

@Module({
  imports: [ContentModule, AuditModule, BoostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
