import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class AddNewsDto {
  @IsNotEmpty()
  @IsString()
  category_id: string;
  @IsNotEmpty()
  @IsString()
  category_name: string;
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
  @IsNotEmpty()
  @IsString()
  image: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsString()
  published_at: string;
}
