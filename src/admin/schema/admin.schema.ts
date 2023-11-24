import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  email: string;

  @Prop()
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
export type AdminDocument = Admin & Document;
