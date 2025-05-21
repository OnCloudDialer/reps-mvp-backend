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
import { AreaTagService } from './area-tag.service';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { AuthUser } from 'src/decorators/authUser';
import { CreateAreaTagDTO } from './dto/create-area-tag.dto';
import { UpdateAreaTagDTO } from './dto/update-area-tag.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('area-tag')
@UseGuards(JwtAuthGuard)
export class AreaTagController {
  constructor(private readonly areaTagService: AreaTagService) {}

  @Post()
  create(
    @Body() createTagDto: CreateAreaTagDTO,
    @AuthUser() user: UserPayload,
  ) {
    return this.areaTagService.create(user, createTagDto);
  }

  @Get()
  findAll(@AuthUser() user: UserPayload) {
    return this.areaTagService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.areaTagService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTagDto: UpdateAreaTagDTO) {
    return this.areaTagService.update(id, updateTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.areaTagService.remove(id);
  }
}
