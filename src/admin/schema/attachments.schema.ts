import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Attachment {
  @Prop()
  news_id: mongoose.Types.ObjectId;

  @Prop()
  user_id: mongoose.Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  file_name: string;

  @Prop()
  mime_type: string;

  @Prop()
  path: string;

  @Prop()
  base_url: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
export type AttachmentDocument = Attachment & Document;
