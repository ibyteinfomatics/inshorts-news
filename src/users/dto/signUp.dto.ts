import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['signUp', 'skip'])
  type: string;

  @ValidateIf((o) => o.type === 'signUp')
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  device_token: string;

  @IsNotEmpty()
  @IsString()
  device_id: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['ios', 'android'])
  device_type: string;

  @ValidateIf((o) => o.type === 'signUp')
  @IsNotEmpty()
  @IsString()
  password: string;

  @ValidateIf((o) => o.type === 'signUp')
  @IsOptional()
  @IsString()
  first_name: string;

  @ValidateIf((o) => o.type === 'signUp')
  @IsOptional()
  @IsString()
  last_name: string;
}
