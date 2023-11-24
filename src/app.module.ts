import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ENV } from 'config/environment';
import { AdminModule } from './admin/admin.module';
import { AdminMiddleWare } from './admin/middleware/admin.middleware';
import { AdminController } from './admin/admin.controller';
import { Admin, AdminSchema } from './admin/schema/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { Category, CategorySchema } from './users/schema/categories.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot(ENV.DB_URL),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleWare).forRoutes(AdminController);
  }
}
