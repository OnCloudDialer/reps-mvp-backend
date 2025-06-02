import { Module } from '@nestjs/common';
import { VisitService } from './visit.service';
import { VisitController } from './visit.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [VisitService, PrismaService],
  controllers: [VisitController],
})
export class VisitModule {}
