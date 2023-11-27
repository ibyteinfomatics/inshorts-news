import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(['signIn', 'skip'])
  type: string;

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

  @ValidateIf((o) => o.type === 'signIn')
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((o) => o.type === 'signIn')
  @IsNotEmpty()
  @IsString()
  password: string;
}
