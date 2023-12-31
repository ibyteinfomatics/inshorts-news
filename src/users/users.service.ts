import { HttpStatus, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/signUp.dto';
import { Response } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ENV } from 'config/environment';
import {
  MapUserDevice,
  MapUserDeviceDocument,
} from './schema/mapUserDevice.schema';
import { Category, CategoryDocument } from './schema/categories.schema';
import { News, NewsDocument } from './schema/news.schema';
import { AddPreferredCategoryDto } from './dto/addpreferredcategory.dto';
import {
  MapUserCategory,
  MapUserCategoryDocument,
} from './schema/mapusercategory.schema';
import { MapNewsSeen, MapNewsSeenDocument } from './schema/newsseen.schema';
import { GetAllNewsDto } from './dto/getallnews.dto';
import {
  PreferredCategory,
  PreferredCategoryDocument,
} from './schema/preffedCategory.schema';
import { AllNewsByCatgeory } from './dto/getallnewsbycategory.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(MapUserDevice.name)
    private readonly mapUserDeviceModel: Model<MapUserDeviceDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(News.name) private readonly newsModel: Model<NewsDocument>,
    @InjectModel(MapUserCategory.name)
    private readonly mapUserCategoryModel: Model<MapUserCategoryDocument>,
    @InjectModel(MapNewsSeen.name)
    private mapNewsSeenModel: Model<MapNewsSeenDocument>,
    @InjectModel(PreferredCategory.name)
    private readonly preferredCategoryModel: Model<PreferredCategoryDocument>,
    private readonly jwtService: JwtService,
  ) {}

  //-----------------------SignUp---------------------------//
  async signUp(body: SignUpDto, res: Response) {
    try {
      if (body.type === 'skip') {
        await new this.mapUserDeviceModel({
          device_id: body.device_id,
          device_token: body.device_token,
          device_type: body.device_type,
        }).save();
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'SignUp skipped successfully',
        });
      } else {
        const user = await this.userModel.findOne({ email: body.email });
        if (user) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Email already registered',
          });
        }
        const hashedPassword = await bcrypt.hash(body.password, 10);
        const newUser = await new this.userModel({
          email: body.email,
          password: hashedPassword,
          first_name: body.first_name,
          last_name: body.last_name,
        }).save();
        await new this.mapUserDeviceModel({
          device_token: body.device_token,
          device_type: body.device_type,
          device_id: body.device_id,
          user_id: newUser._id,
        }).save();
        return res.status(HttpStatus.CREATED).json({
          success: true,
          message: 'SignUp successfull',
          newUser,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //-----------------------SignIn---------------------------//
  async SignIn(body: SignInDto, res: Response) {
    try {
      const findDevice = await this.mapUserDeviceModel.findOne({
        device_token: body.device_token,
      });
      if (body.type === 'skip') {
        if (!findDevice) {
          await new this.mapUserDeviceModel({
            device_id: body.device_id,
            device_token: body.device_token,
            device_type: body.device_type,
          }).save();
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'SignIn skipped successfully',
        });
      } else {
        const user = await this.userModel.findOne({ email: body.email });
        if (!user) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Email not registered.',
          });
        }
        const matchedPassword = await bcrypt.compare(
          body.password,
          user.password,
        );
        if (!matchedPassword) {
          return res.status(HttpStatus.BAD_REQUEST).json({
            success: false,
            message: 'Wrong password entered.',
          });
        }
        const payload = {
          id: user._id,
          role: 'user',
        };
        const token = await this.jwtService.sign(payload, {
          secret: ENV.JWT_SECRET_KEY,
        });
        if (!findDevice) {
          await new this.mapUserDeviceModel({
            device_token: body.device_token,
            device_type: body.device_type,
            device_id: body.device_id,
            user_id: user._id,
          }).save();
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          message: 'SignIn successfull.',
          token,
          user,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Add Preferred Category----------------------//
  async addPreferredCategory(body: AddPreferredCategoryDto, res: Response) {
    try {
      for (const key of body.category_ids) {
        const preferredCategory = await this.mapUserCategoryModel.findOne({
          $or: [
            {
              user_id: body.user_id,
              category_id: new mongoose.Types.ObjectId(key),
            },
            {
              device_token: body.device_id,
              category_id: new mongoose.Types.ObjectId(key),
            },
          ],
        });
        if (preferredCategory) {
          await this.mapUserCategoryModel.findOneAndUpdate(
            {
              $or: [
                {
                  user_id: body.user_id,
                  category_id: new mongoose.Types.ObjectId(key),
                },
                {
                  device_token: body.device_id,
                  category_id: new mongoose.Types.ObjectId(key),
                },
              ],
            },
            {
              priority: body.priority,
            },
          );
        } else {
          await new this.mapUserCategoryModel({
            user_id: body.user_id
              ? new mongoose.Types.ObjectId(body.user_id)
              : '',
            device_id: body.device_id ? body.device_id : '',
            category_id: new mongoose.Types.ObjectId(key),
            priority: body.priority,
          }).save();
        }
      }
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Preference created successfully.',
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Get All News----------------------//
  async getAllNews(body: GetAllNewsDto, page = 1, limit = 10, res: Response) {
    try {
      const userCategories = await this.mapUserCategoryModel.find({
        $or: [
          { user_id: new mongoose.Types.ObjectId(body.user_id) },
          { device_id: body.device_id },
        ],
      });
      const favourites = [];
      const notInterested = [];
      for (const category of userCategories) {
        if (category.priority === 'all') {
          favourites.push(category.category_id);
        }
        if (category.priority === 'no') {
          notInterested.push(category.category_id);
        }
      }
      const allNews = await this.newsModel.countDocuments({
        category_id: { $nin: notInterested },
      });
      const seenNews = await this.mapNewsSeenModel.find({
        $or: [
          { device_id: body.device_id },
          { user_id: new mongoose.Types.ObjectId(body.user_id) },
        ],
      });
      if (allNews === seenNews.length) {
        await this.mapNewsSeenModel.deleteMany({
          $or: [
            { user_id: new mongoose.Types.ObjectId(body.user_id) },
            { device_id: body.device_id },
          ],
        });
        seenNews.length = await this.mapNewsSeenModel.countDocuments({
          $or: [
            { device_token: body.device_id },
            { user_id: new mongoose.Types.ObjectId(body.user_id) },
          ],
        });
      }
      const favouriteNewsCount = await this.newsModel.countDocuments({
        $and: [
          { category_id: { $in: favourites } },
          { category_id: { $nin: notInterested } },
        ],
      });
      const seenArr = [];
      for (const news of seenNews) {
        seenArr.push(news.news_id);
      }
      if (
        seenNews.length === favouriteNewsCount &&
        seenNews.length !== allNews
      ) {
        const newNews = await this.newsModel
          .find({
            category_id: { $nin: notInterested },
            _id: { $nin: seenArr },
          })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
        for (const news of newNews) {
          await new this.mapNewsSeenModel({
            news_id: news._id,
            device_id: body.device_id ? body.device_id : '',
            user_id: body.user_id
              ? new mongoose.Types.ObjectId(body.user_id)
              : '',
          }).save();
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          newNews,
        });
      }
      if (seenNews.length < allNews) {
        const lastNews = await this.newsModel
          .find({
            category_id: { $nin: notInterested },
            _id: { $nin: seenArr },
          })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit);
        for (const news of lastNews) {
          await new this.mapNewsSeenModel({
            news_id: news._id,
            device_id: body.device_id ? body.device_id : '',
            user_id: body.user_id
              ? new mongoose.Types.ObjectId(body.user_id)
              : '',
          }).save();
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          lastNews,
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Get All News By Category----------------------//
  async getAllNewsByCategory(
    limit = 10,
    body: AllNewsByCatgeory,
    res: Response,
  ) {
    try {
      const findCategory = await this.categoryModel.findOne({
        slug: body.category,
      });
      if (!findCategory) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Category not found',
        });
      }
      const noNewsCatgeory = await this.mapUserCategoryModel.findOne({
        $or: [
          {
            user_id: new mongoose.Types.ObjectId(body.user_id),
            priority: 'no',
            category_id: findCategory._id,
          },
          {
            device_id: body.device_id,
            priority: 'no',
            category_id: findCategory._id,
          },
        ],
      });
      if (noNewsCatgeory) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'You have unfollowed this category',
        });
      }
      const seenNews = await this.mapNewsSeenModel.find({
        $or: [
          { user_id: new mongoose.Types.ObjectId(body.user_id) },
          { device_id: body.device_id },
        ],
      });
      if (seenNews.length > 0) {
        let seenNewsArr = [];
        for (let item of seenNews) {
          seenNewsArr.push(item.news_id);
        }
        const categoryNewsCount = await this.newsModel.countDocuments({
          category_id: findCategory._id,
        });
        const categoryNotSeenNewsCount = await this.newsModel.countDocuments({
          _id: { $nin: seenNewsArr },
          category_id: new mongoose.Types.ObjectId(findCategory._id),
        });
        if (categoryNotSeenNewsCount === 0) {
          await this.mapNewsSeenModel.deleteMany({
            $or: [
              { user_id: new mongoose.Types.ObjectId(body.user_id) },
              { device_id: body.device_id },
            ],
          });
          seenNewsArr = [];
        }
        const newNews = await this.newsModel
          .find({ _id: { $nin: seenNewsArr }, category_id: findCategory._id })
          .sort({ createdAt: -1 })
          .limit(limit);
        for (let i = 0; i < newNews.length; i++) {
          await new this.mapNewsSeenModel({
            news_id: new mongoose.Types.ObjectId(newNews[i]._id),
            user_id: body.user_id
              ? new mongoose.Types.ObjectId(body.user_id)
              : '',
            device_id: body.device_id ? body.device_id : '',
          }).save();
        }
        return res.status(HttpStatus.OK).json({
          success: true,
          newNews,
        });
      }
      const news = await this.newsModel
        .find({ category_id: findCategory._id })
        .sort({ createdAt: -1 })
        .limit(limit);
      for (let i = 0; i < news.length; i++) {
        await new this.mapNewsSeenModel({
          news_id: new mongoose.Types.ObjectId(news[i]._id),
          user_id: body.user_id
            ? new mongoose.Types.ObjectId(body.user_id)
            : '',
          device_id: body.device_id ? body.device_id : '',
        }).save();
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        news,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //----------------------Get All Categories------------------------//
  async getAllCategories(type: string, id: string, res: Response) {
    try {
      if (type === 'by_user' || type === 'by_device') {
        let choosedCategories;
        if (type === 'by_user') {
          choosedCategories = await this.mapUserCategoryModel.aggregate([
            {
              $match: {
                user_id: new mongoose.Types.ObjectId(id),
              },
            },
            {
              $sort: { updatedAt: -1 },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
            {
              $lookup: {
                from: 'categories',
                as: 'category',
                let: { category_id: '$category_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$category_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true,
              },
            },
          ]);
        } else {
          choosedCategories = await this.mapUserCategoryModel.aggregate([
            {
              $match: {
                device_id: id,
              },
            },
            {
              $sort: { updatedAt: -1 },
            },
            {
              $project: {
                createdAt: 0,
                updatedAt: 0,
                __v: 0,
              },
            },
            {
              $lookup: {
                from: 'categories',
                as: 'category',
                let: { category_id: '$category_id' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$_id', '$$category_id'],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      createdAt: 0,
                      updatedAt: 0,
                      __v: 0,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$category',
                preserveNullAndEmptyArrays: true,
              },
            },
          ]);
        }
        const choosedCategoriesId = [];
        if (choosedCategories.length > 0) {
          for (let i = 0; i < choosedCategories.length; i++) {
            choosedCategoriesId.push(choosedCategories[i].category_id);
          }
        }
        const notChoosedCategories = await this.categoryModel
          .find({
            _id: { $nin: choosedCategoriesId },
          })
          .select({ createdAt: 0, updatedAt: 0, __v: 0 });
        return res.status(HttpStatus.OK).json({
          success: true,
          choosedCategories,
          notChoosedCategories,
        });
      } else {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Type must be by_user or by_device',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  //-----------------------Update Profile------------------------//
  async updateProfile(
    user_id: string,
    file: Express.Multer.File,
    res: Response,
  ) {
    try {
      const user = await this.userModel.findById(user_id);
      if (!user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: 'User not found',
        });
      }
      
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
