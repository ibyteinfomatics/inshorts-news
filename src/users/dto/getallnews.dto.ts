import { IsIn, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class GetAllNewsDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['by_user', 'by_device'])
  type: string;

  @ValidateIf((o) => o.type === 'by_user')
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @ValidateIf((o) => o.type === 'by_device')
  @IsNotEmpty()
  @IsString()
  device_id: string;
}
