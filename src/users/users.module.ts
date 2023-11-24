import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MapUserDevice,
  MapUserDeviceSchema,
} from './schema/mapUserDevice.schema';
import {
  MapUserLanguage,
  MapUserLanguageSchema,
} from './schema/language.schema';
import { Category, CategorySchema } from './schema/categories.schema';
import { News, NewsSchema } from './schema/news.schema';
import { User, UserSchema } from './schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import {
  MapUserCategory,
  MapUserCategorySchema,
} from './schema/mapusercategory.schema';
import { MapNewsSeen, MapNewsSeenSchema } from './schema/newsseen.schema';
import {
  PreferredCategory,
  PreferredCategorySchema,
} from './schema/preffedCategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: MapUserDevice.name, schema: MapUserDeviceSchema },
      { name: MapUserLanguage.name, schema: MapUserLanguageSchema },
      { name: Category.name, schema: CategorySchema },
      { name: News.name, schema: NewsSchema },
      { name: MapNewsSeen.name, schema: MapNewsSeenSchema },
      { name: PreferredCategory.name, schema: PreferredCategorySchema },
      {
        name: MapUserCategory.name,
        schema: MapUserCategorySchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
})
export class UsersModule {}
