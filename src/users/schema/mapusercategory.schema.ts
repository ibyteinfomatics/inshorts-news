import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Category } from './categories.schema';

@Schema({ timestamps: true })
export class MapUserCategory {
  @Prop({ default: null })
  user_id: mongoose.Types.ObjectId;

  @Prop()
  device_token: string;

  @Prop()
  category_id: mongoose.Types.ObjectId;

  @Prop({ enum: ['all', 'major', 'no'] })
  priority: string;
}

export const MapUserCategorySchema =
  SchemaFactory.createForClass(MapUserCategory);
export type MapUserCategoryDocument = MapUserCategory & Document;
