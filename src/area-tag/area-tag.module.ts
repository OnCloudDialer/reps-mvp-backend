import { Module } from '@nestjs/common';
import { AreaTagController } from './area-tag.controller';
import { AreaTagService } from './area-tag.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AreaTagController],
  providers: [AreaTagService, PrismaService],
})
export class AreaTagModule {}
