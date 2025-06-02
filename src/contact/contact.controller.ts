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
import { CreateStoreContactDTO } from 'src/store/dto/create-store-contact.dto';
import { UpdateStoreContactDto } from 'src/store/dto/update-store-contact.dto';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { CreateContactNoteDTO } from 'src/store/dto/create-contact-note.dto';

@UseGuards(JwtAuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('find-all')
  findAllContacts(
    @Param('id') id: string,
    @Param('storeId') storeId: string,
    @AuthUser() user: UserPayload,
    @Query('role') role: string,
    @Query('name') name: string,
  ) {
    return this.contactService.findAll(user.organizationId, id, {
      storeId,
      role: role,
      name,
    });
  }

  @Get('find/:id')
  findOneContact(@Param('id') id: string, @AuthUser() user: UserPayload) {
    return this.contactService.findOne(user.organizationId, id);
  }

  @Post('create')
  createStoreContact(
    @AuthUser() user: UserPayload,
    @Body() data: CreateStoreContactDTO,
  ) {
    return this.contactService.createStoreContact(
      user.organizationId,
      user.id,
      data,
    );
  }

  @Post('create-note')
  createContactNote(
    @AuthUser() user: UserPayload,
    @Body() data: CreateContactNoteDTO,
  ) {
    return this.contactService.createContactNote(data);
  }

  @Get('notes/:contactId')
  getContactNotes(
    @AuthUser() user: UserPayload,
    @Param('contactId') contactId: string,
  ) {
    return this.contactService.findContactNotes(user.organizationId, contactId);
  }

  @Delete('delete/:id')
  deleteContact(@AuthUser() user: UserPayload, @Param('id') id: string) {
    return this.contactService.deleteContact(user.organizationId, user.id, id);
  }

  @Patch('update')
  updateStoreContact(
    @AuthUser() user: UserPayload,
    @Body() data: UpdateStoreContactDto,
  ) {
    return this.contactService.updateStoreContact(
      user.organizationId,
      user.id,
      data,
    );
  }
}
