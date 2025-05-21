import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AuthUser } from 'src/decorators/authUser';
import { UserPayload } from 'src/auth/dto/jwt.user.dto';
import { CreateStoreNoteDto } from './dto/create-store-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(
    @Body() createStoreDto: CreateStoreDto,
    @AuthUser() user: UserPayload,
  ) {
    return this.storeService.create(
      user.organizationId,
      user.id,
      createStoreDto,
    );
  }

  @Get()
  findAll(
    @Query('tagIds') tagIds: string,
    @Query('areaTagIds') areaTagIds: string,
    @Query('name') name: string,
    @Query('contactId') contactId: string,
    @AuthUser() user: UserPayload,
  ) {
    return this.storeService.findAll(user.id, user.organizationId, {
      tagIds,
      name,
      contactId,
      areaTagIds,
    });
  }

  @Get('notes/:storeId')
  getStoreNotes(
    @AuthUser() user: UserPayload,
    @Param('storeId') storeId: string,
  ) {
    return this.storeService.findStoreNotes(user.organizationId, storeId);
  }

  @Post('create-note')
  createStoreNote(
    @AuthUser() user: UserPayload,
    @Body() data: CreateStoreNoteDto,
  ) {
    return this.storeService.createStoreNote(data);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: UserPayload) {
    return this.storeService.findOne(user.organizationId, id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoreDto: UpdateStoreDto,
    @AuthUser() user: UserPayload,
  ) {
    return this.storeService.update(user.organizationId, id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(id);
  }
}
