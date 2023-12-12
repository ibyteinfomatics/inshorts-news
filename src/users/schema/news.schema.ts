import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class News {
  @Prop()
  category_id: mongoose.Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  category_name: string;

  @Prop()
  source: string;

  @Prop()
  author: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  reference_link: string;

  @Prop()
  image: mongoose.Types.ObjectId;

  @Prop()
  content: string;

  @Prop()
  published_at: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
export type NewsDocument = News & Document;
