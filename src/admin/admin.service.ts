import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminLoginDto } from './dto/adminlogin.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { ENV } from 'config/environment';
import { AddCategoryDto } from './dto/addcategory.dto';
import { Category, CategoryDocument } from 'src/users/schema/categories.schema';
import axios from 'axios';
import { News, NewsDocument } from 'src/users/schema/news.schema';
import { User, UserDocument } from 'src/users/schema/user.schema';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { FetchNewsDto } from './dto/fetchnews.dto';
import { Attachment, AttachmentDocument } from './schema/attachments.schema';
import { AddNewsDto } from './dto/addnews.dto';
import {
  Notification,
  NotificationDocument,
} from './schema/notification.schema';

@Injectable()
export class AdminService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentModel: Model<AttachmentDocument>,
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async login(body: AdminLoginDto, res: Response) {
    try {
      const admin = await this.adminModel.findOne({ email: body.email });
      if (!admin) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Admin not exist',
        });
      }
      const matchPassword = await bcrypt.compare(body.password, admin.password);
      if (!matchPassword) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Invalid Credentials',
        });
      }
      const payload = {
        id: admin._id,
        role: 'admin',
      };
      const token = await this.jwtService.sign(payload, {
        secret: ENV.JWT_SECRET_KEY,
      });
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Admin login successfull',
        token,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //------------------------DashBoard--------------------------//
  async dashBoard(res: Response) {
    try {
      const usersCount = await this.userModel.countDocuments();
      const categoriesCount = await this.categoryModel.countDocuments();
      const newsCount = await this.newsModel.aggregate([
        { $group: { _id: '$category_name', count: { $sum: 1 } } },
      ]);
      const obj = {};
      let totalNews = 0;
      for (const key of newsCount) {
        obj[key._id] = key.count;
        totalNews += key.count;
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        totalUsers: usersCount,
        totalNews,
        totalCategories: categoriesCount,
        ...obj,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Add Category------------------------//
  async addCategory(body: AddCategoryDto, res: Response) {
    try {
      const category = await this.categoryModel.findOne({ title: body.title });
      if (category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Category already exist.',
        });
      }
      const newCategory = await new this.categoryModel(body).save();
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'New category added successfully.',
        newCategory,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Get All Categories------------------------//
  async getAllCategories(res: Response) {
    try {
      const categories = await this.categoryModel.find();
      return res.status(HttpStatus.OK).json({
        success: true,
        categories,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Update Category------------------------//
  async updateCategory(
    category_id: string,
    body: UpdateCategoryDto,
    res: Response,
  ) {
    try {
      const category = await this.categoryModel.findById(category_id);
      if (!category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Category does not exist',
        });
      }
      await this.categoryModel.findByIdAndUpdate(category_id, body);
      return res.status(HttpStatus.OK).json({
        success: false,
        message: 'Category updated successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Delete Category------------------------//
  async deleteCategory(category_id: string, res: Response) {
    try {
      const category = await this.categoryModel.findById(category_id);
      if (!category) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Category does not exist',
        });
      }
      await this.categoryModel.findByIdAndDelete(category_id);
      await this.newsModel.deleteMany({ category_id: category_id });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //---------------Fetch News From Api And Save----------------------//
  async fetchNewsAndSave(body: FetchNewsDto, res: Response) {
    try {
      const findCategory = await this.categoryModel.findOne({
        slug: { $regex: `.*${body.category}.*`, $options: 'i' },
      });
      if (!findCategory) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Category not found',
        });
      }

      let url;
      if (body.type === 'all') {
        url = `https://newsapi.org/v2/everything?q=${body.category}&apiKey=${ENV.API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?country=in&category=${body.category}&apiKey=${ENV.API_KEY}`;
      }
      const news = await axios.get(url);
      for (const key of news.data.articles) {
        await new this.newsModel({
          category_id: new mongoose.Types.ObjectId(findCategory._id),
          category_name: findCategory.slug,
          type: body.type,
          source: key.source?.name ?? '',
          author: key.author ?? '',
          title: key.title ?? '',
          description: key.description ?? '',
          reference_link: key.url ?? '',
          image: key.urlToImage ?? '',
          content: key.content ?? '',
          published_at: new Date(key.publishedAt) ?? '',
        }).save();
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'News fetched successfully.',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async addNews(
    req: Request,
    body: AddNewsDto,
    file: Express.Multer.File,
    res: Response,
  ) {
    try {
      const news = await this.newsModel.findOne({
        title: body.title,
        source: body.source,
      });
      if (news) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'News already exist',
        });
      }
      const category = await this.categoryModel.findOne({
        slug: body.category,
      });
      if (!file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Image is Required',
        });
      }
      const url = `${req.protocol}://${req.headers.host}/uploads/${file.filename}`;
      await new this.newsModel({
        category_id: new mongoose.Types.ObjectId(category._id),
        category_name: body.category,
        type: body.type,
        source: body.source,
        author: body.author,
        title: body.title,
        description: body.description,
        reference_link: body.reference_link,
        image: url,
        content: body.content,
        published_at: new Date(),
      }).save();
      const users = await this.userModel.find();
      for (const user of users) {
        await new this.notificationModel({
          sender_type: 'admin',
          sender_id: null,
          receiver_type: 'user',
          receiver_id: user._id,
          type: 'news',
          action: 'news posted',
          title: 'New news',
          body: 'New news available',
        }).save();
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'News added successfully',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
