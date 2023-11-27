import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schema/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { Category, CategorySchema } from 'src/users/schema/categories.schema';
import { News, NewsSchema } from 'src/users/schema/news.schema';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Attachment, AttachmentSchema } from './schema/attachments.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Category.name, schema: CategorySchema },
      { name: News.name, schema: NewsSchema },
      { name: User.name, schema: UserSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtService],
})
export class AdminModule {}
