import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { AuthUser } from 'src/decorators/authUser';
import { VisitService } from './visit.service';
import { UpdateVisitDTO } from './dto/update.visit.dto';
import { CreateVisitDTO } from './dto/create.visit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateVisitNoteDto } from './dto/create-visit-note.dto';
import { CreateVisitActivityDTO } from './dto/create-visit-activity.dto';
import { VisitType } from '@prisma/client';

@Controller('visit')
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  create(@Body() createTagDto: CreateVisitDTO, @AuthUser() user: UserPayload) {
    return this.visitService.create(user, createTagDto);
  }

  @Get()
  findAll(@AuthUser() user: UserPayload, @Query('type') type: string) {
    return this.visitService.findAll(user, { type: type as VisitType });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateVisitDTO) {
    return this.visitService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitService.remove(id);
  }

  @Get('notes/:visitId')
  getVisitNotes(
    @AuthUser() user: UserPayload,
    @Param('visitId') visitId: string,
  ) {
    return this.visitService.findVisitNotes(user.organizationId, visitId);
  }

  @Post('create-note')
  createVisitNote(
    @AuthUser() user: UserPayload,
    @Body() data: CreateVisitNoteDto,
  ) {
    return this.visitService.createVisitNote(data);
  }

  @Get('activity/:visitId')
  getVisitActivity(
    @AuthUser() user: UserPayload,
    @Param('visitId') visitId: string,
  ) {
    return this.visitService.findVisitActivity(user.organizationId, visitId);
  }

  @Post('create-activity')
  createVisitActivity(
    @AuthUser() user: UserPayload,
    @Body() data: CreateVisitActivityDTO,
  ) {
    return this.visitService.createVisitActivity(data);
  }
}
