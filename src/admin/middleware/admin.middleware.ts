import { HttpStatus, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schema/admin.schema';
import { ENV } from 'config/environment';

export class AdminMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(Admin.name) private readonly adminModel: Model<AdminDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const path = ['/admin/login'];
      if (path.includes(req.originalUrl)) {
        next();
      } else if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        const decode = await this.jwtService.verify(token, {
          secret: ENV.JWT_SECRET_KEY,
        });
        if (decode.hasOwnProperty('role') && decode.hasOwnProperty('id')) {
          const user = await this.adminModel.findById(decode.id);
          if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
              success: false,
              message: 'Unauthorized Access',
            });
          }
          next();
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            success: false,
            message: 'Unauthorized access',
          });
        }
      } else {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          succces: false,
          message: 'Unauthorized Access',
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
