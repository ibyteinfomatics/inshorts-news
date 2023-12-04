import { Injectable, OnModuleInit } from '@nestjs/common';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from './admin/schema/admin.schema';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './users/schema/categories.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async onModuleInit() {
    const admin = await this.adminModel.findOne({ email: 'admin@admin.com' });
    if (!admin) {
      const password = await bcrypt.hash('Admin@123', 10);
      const myAdmin = await new this.adminModel({
        email: 'admin@admin.com',
        password: password,
      }).save();
      console.log(`MY-ADMIN :- ${myAdmin}`);
    }

    const data = [
      { title: 'Sports', slug: 'sports' },
      { title: 'Entertainment', slug: 'entertainment' },
      { title: 'Business', slug: 'business' },
      { title: 'Science', slug: 'science' },
      { title: 'Health', slug: 'health' },
      { title: 'Technology', slug: 'technology' },
      { title: 'General', slug: 'general' },
    ];
    for (const key of data) {
      const category = await this.categoryModel.findOne({ slug: key.slug });
      if (!category) {
        await new this.categoryModel(key).save();
        console.log(`Default category ${key.title} created successfully`);
      }
    }
  }
  getHello(): string {
    return '<h1 style="margin-left: 420px; margin-top: 300px" >Hello This Is Inshorts-News-Api</h1>';
  }
}
