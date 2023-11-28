import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AddNewsDto {
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNotEmpty()
  @IsString()
  @IsIn(['major', 'all'])
  type: string;
  @IsNotEmpty()
  @IsString()
  source: string;
  @IsNotEmpty()
  @IsString()
  author: string;
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsString()
  reference_link: string;
  @IsOptional()
  @IsString()
  content: string;
}
