import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact, ContactRole, Notes, Prisma } from '@prisma/client';
import { ApiResponseDto } from 'src/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactNoteDTO } from 'src/store/dto/create-contact-note.dto';
import { CreateStoreContactDTO } from 'src/store/dto/create-store-contact.dto';
import { UpdateStoreContactDto } from 'src/store/dto/update-store-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    id: string,
    { role, name }: { role: string; name: string },
  ): Promise<ApiResponseDto<Contact[]>> {
    const query: Prisma.ContactWhereInput = {
      organizationId,
      ...(role && {
        role: {
          in: role.split(',') as ContactRole[],
        },
      }),
      ...(name && { name }),
    };
    const contacts = await this.prisma.contact.findMany({
      where: query,
      include: {
        StoreContact: {
          include: {
            store: true,
          },
        },
      },
    });

    return {
      data: contacts,
      message: '',
    };
  }
  async createStoreContact(
    organizationId: string,
    userId: string,
    data: CreateStoreContactDTO,
  ): Promise<ApiResponseDto<Contact>> {
    //

    const newContact = await this.prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        role: data.role,
        email: data.email,
        organizationId,
        userId,
      },
    });
    // Associating Contact with the Store

    await Promise.all(
      data.storeIds.map(async (id) => {
        await this.prisma.storeContact.create({
          data: {
            storeId: id,
            contactId: newContact.id,
          },
        });
      }),
    );

    return {
      data: newContact,
      message: 'New Contact Created!',
    };
  }

  async createContactNote(
    data: CreateContactNoteDTO,
  ): Promise<ApiResponseDto<Notes>> {
    //

    const newNote = await this.prisma.notes.create({
      data: {
        type: 'CONTACT_NOTE',
        content: data.note,
      },
    });

    // associating with Contact
    await this.prisma.contactNotes.create({
      data: {
        contactId: data.contactId,
        noteId: newNote.id,
      },
    });

    return {
      data: newNote,
      message: 'New Note Created',
    };
  }

  async findContactNotes(
    organizationId: string,
    contactId: string,
  ): Promise<ApiResponseDto<Notes[]>> {
    const checkContact = await this.prisma.contact.findFirst({
      where: {
        organizationId,
        id: contactId,
        ContactNotes: {
          every: {
            note: {
              type: 'CONTACT_NOTE',
            },
          },
        },
      },
      include: {
        ContactNotes: {
          include: {
            note: true,
          },
        },
      },
    });
    if (!checkContact) {
      throw new NotFoundException('No Contact Found with this ID!');
    }

    const contactNotes = checkContact.ContactNotes.map(({ note }) => note);

    return {
      data: contactNotes,
      message: '',
    };
  }

  async findOne(
    organizationId: string,
    id: string,
  ): Promise<ApiResponseDto<Contact>> {
    const checkContact = await this.prisma.contact.findFirst({
      where: {
        organizationId,
        id,
      },
      include: {
        StoreContact: {
          include: {
            store: true,
          },
        },
      },
    });
    if (!checkContact) {
      throw new NotFoundException('No Contact Found with this ID!');
    }
    return {
      message: '',
      data: checkContact,
    };
  }

  async deleteContact(
    organizationId: string,
    userId: string,
    id: string,
  ): Promise<ApiResponseDto<null>> {
    const checkStoreContact = await this.prisma.contact.findFirst({
      where: {
        organizationId,
        userId,
        id,
      },
    });
    if (!checkStoreContact) {
      throw new NotFoundException('No Contact Found with this Id!');
    }

    await this.prisma.contact.delete({
      where: {
        id,
      },
    });
    //
    return {
      data: null,
      message: 'Contact Deleted!',
    };
  }

  async updateStoreContact(
    organizationId: string,
    userId: string,
    data: UpdateStoreContactDto,
  ): Promise<ApiResponseDto<Contact>> {
    //
    const checkStoreContact = await this.prisma.contact.findFirst({
      where: {
        organizationId,
        userId,
        id: data.id,
      },
    });
    if (!checkStoreContact) {
      throw new NotFoundException('No Contact Found with this Id!');
    }

    // deleting Existing Contacts Association
    await this.prisma.storeContact.deleteMany({
      where: {
        AND: [
          {
            storeId: { in: data.storeIds },
          },
          {
            contactId: data.id,
          },
        ],
      },
    });

    // Updating Contact
    const updatedRecord = await this.prisma.contact.update({
      where: {
        id: checkStoreContact.id,
      },
      data: {
        name: data.name,
        phone: data.phone,
        role: data.role,
        email: data.email,
      },
    });

    // Associating Contact with the Store

    await Promise.all(
      data.storeIds.map(async (id) => {
        await this.prisma.storeContact.create({
          data: {
            storeId: id,
            contactId: data.id,
          },
        });
      }),
    );

    return {
      data: updatedRecord,
      message: 'Contact Updated',
    };
  }
}
