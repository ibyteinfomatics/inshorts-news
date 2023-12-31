import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/adminlogin.dto';
import { Request, Response } from 'express';
import { AddCategoryDto } from './dto/addcategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { FetchNewsDto } from './dto/fetchnews.dto';
import { AddNewsDto } from './dto/addnews.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, mediaFileFilter } from 'src/helper/fileupload.helper';
import { diskStorage } from 'multer';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  //----------------------Login------------------------//
  @Post('login')
  async login(@Body() body: AdminLoginDto, @Res() res: Response) {
    return await this.adminService.login(body, res);
  }

  //------------------------DashBoard--------------------------//
  @Get('dashboard')
  async dashBoard(@Res() res: Response) {
    return await this.adminService.dashBoard(res);
  }

  //----------------------Add Category------------------------//
  @Post('add_category')
  async addCategory(@Body() body: AddCategoryDto, @Res() res: Response) {
    return await this.adminService.addCategory(body, res);
  }

  //----------------------Get All Categories------------------------//
  @Get('get_all_categories')
  async getAllCategories(@Res() res: Response) {
    return await this.adminService.getAllCategories(res);
  }

  //----------------------Update Category------------------------//
  @Put('update_category')
  async updateCategory(
    @Param('category_id') category_id: string,
    @Body() body: UpdateCategoryDto,
    @Res() res: Response,
  ) {
    return await this.adminService.updateCategory(category_id, body, res);
  }

  //----------------------Delete Category------------------------//
  @Delete('delete_category')
  async deleteCategory(
    @Param('category_id') category_id: string,
    @Res() res: Response,
  ) {
    return await this.adminService.deleteCategory(category_id, res);
  }

  //-------------------Fetch News From Api And Save----------------------//
  @Post('fetch_news_and_save')
  async fetchNewsAndSave(@Body() body: FetchNewsDto, @Res() res: Response) {
    return await this.adminService.fetchNewsAndSave(body, res);
  }

  //-------------------Add News----------------------//
  @Post('add_news')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: mediaFileFilter,
    }),
  )
  async addNews(
    @Req() req: Request,
    @Body() body: AddNewsDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    return await this.adminService.addNews(req, body, file, res);
  }
}
