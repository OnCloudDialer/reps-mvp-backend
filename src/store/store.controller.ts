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
import { CreateStoreContactDTO } from './dto/create-store-contact.dto';
import { UpdateStoreContactDto } from './dto/update-store-contact.dto';

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
    @Query('name') name: string,
    @AuthUser() user: UserPayload,
  ) {
    return this.storeService.findAll(user.id, user.organizationId, {
      tagIds,
      name,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @AuthUser() user: UserPayload) {
    return this.storeService.findOne(user.organizationId, id);
  }

  @Delete('contacts/:id')
  deleteStoreContact(@Param('id') id: string, @AuthUser() user: UserPayload) {
    return this.storeService.deleteStoreContact(user.organizationId, id);
  }
  @Get('contacts/:id')
  findStoreContacts(
    @Param('id') id: string,
    @AuthUser() user: UserPayload,
    @Query('roles') roles: string,
    @Query('name') name: string,
  ) {
    return this.storeService.findStoreContacts(user.organizationId, id, {
      role: roles,
      name,
    });
  }

  @Post('contacts/create')
  createStoreContact(
    @AuthUser() user: UserPayload,
    @Body() data: CreateStoreContactDTO,
  ) {
    return this.storeService.createStoreContact(
      user.organizationId,
      user.id,
      data,
    );
  }

  @Patch('contacts/update')
  updateStoreContact(
    @AuthUser() user: UserPayload,
    @Body() data: UpdateStoreContactDto,
  ) {
    return this.storeService.updateStoreContact(
      user.organizationId,
      user.id,
      data,
    );
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
