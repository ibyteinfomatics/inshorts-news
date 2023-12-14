import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignUpDto } from './dto/signUp.dto';
import { Response } from 'express';
import { SignInDto } from './dto/login.dto';
import { AddPreferredCategoryDto } from './dto/addpreferredcategory.dto';
import { GetAllNewsDto } from './dto/getallnews.dto';
import { AllNewsByCatgeory } from './dto/getallnewsbycategory.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //-----------------------SignUp---------------------------//
  @Post('signup')
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    return await this.usersService.signUp(body, res);
  }

  //-----------------------SignIn---------------------------//
  @Post('signin')
  async SignIn(@Body() body: SignInDto, @Res() res: Response) {
    return await this.usersService.SignIn(body, res);
  }

  //----------------------Add Preferred Category----------------------//
  @Post('map_user_category')
  async addPreferredCategory(
    @Body() body: AddPreferredCategoryDto,
    @Res() res: Response,
  ) {
    return await this.usersService.addPreferredCategory(body, res);
  }

  //----------------------Get All News----------------------//
  @Post('get_all_news')
  async getAllNews(
    @Body() body: GetAllNewsDto,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Res() res: Response,
  ) {
    return await this.usersService.getAllNews(body, page, limit, res);
  }

  //----------------------Get All News By Category----------------------//
  @Post('get_all_news_by_category')
  async getAllNewsByCategory(
    @Query('limit') limit:number,
    @Body() body: AllNewsByCatgeory,
    @Res() res: Response,
  ) {
    return await this.usersService.getAllNewsByCategory(limit,body, res);
  }

  //----------------------Get All Categories------------------------//
  @Get('get_all_categories')
  async getAllCategories(@Res() res: Response) {
    return await this.usersService.getAllCategories(res);
  }
}
