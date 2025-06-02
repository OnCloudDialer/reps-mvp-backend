import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { AuthUser } from 'src/decorators/authUser';
import { VisitService } from './visit.service';
import { UpdateVisitDTO } from './dto/update.visit.dto';
import { CreateVisitDTO } from './dto/create.visit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('visit')
@UseGuards(JwtAuthGuard)
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @Post()
  create(@Body() createTagDto: CreateVisitDTO, @AuthUser() user: UserPayload) {
    return this.visitService.create(user, createTagDto);
  }

  @Get()
  findAll(@AuthUser() user: UserPayload) {
    return this.visitService.findAll(user);
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
}
