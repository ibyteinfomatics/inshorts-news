import { IsNotEmpty, IsString } from 'class-validator';

export class AddCategoryDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
