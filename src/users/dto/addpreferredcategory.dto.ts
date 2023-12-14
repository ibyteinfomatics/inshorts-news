import { IsArray, IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class AddPreferredCategoryDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['by_user', 'by_device'])
  type: string;

  @ValidateIf((o) => o.type === 'by_device')
  @IsNotEmpty()
  @IsString()
  device_id: string;

  @ValidateIf((o) => o.type === 'by_user')
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsArray()
  category_ids: Array<string>;

  @IsNotEmpty()
  @IsString()
  @IsIn(['all', 'major', 'no'])
  priority: string;
}
