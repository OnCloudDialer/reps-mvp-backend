import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { StoreModule } from './store/store.module';
import { TagModule } from './tag/tag.module';
import { ActivityModule } from './activity/activity.module';
import { ContactModule } from './contact/contact.module';
import { AreaTagModule } from './area-tag/area-tag.module';
import { ProductsModule } from './products/products.module';
import { MediaModule } from './media/media.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'files'), // serve files folder at /files
      serveRoot: '/files', // accessible at http://localhost:3000/files
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    StoreModule,
    TagModule,
    ActivityModule,
    ContactModule,
    AreaTagModule,
    ProductsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
