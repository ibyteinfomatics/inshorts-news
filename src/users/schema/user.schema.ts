import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
