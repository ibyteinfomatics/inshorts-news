import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class FetchNewsDto {
  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['all', 'major'])
  type: string;
}
