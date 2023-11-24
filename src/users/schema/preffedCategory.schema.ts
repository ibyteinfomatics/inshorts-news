import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class PreferredCategory {
  @Prop()
  device_id: string;

  @Prop()
  user_id: mongoose.Types.ObjectId;

  @Prop()
  category_id: Array<mongoose.Types.ObjectId>;

  @Prop({ enum: ['all', 'major', 'no'], default: 'all' })
  priority: string;
}

export const PreferredCategorySchema =
  SchemaFactory.createForClass(PreferredCategory);
export type PreferredCategoryDocument = PreferredCategory & Document;
