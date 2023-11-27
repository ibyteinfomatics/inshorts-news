import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class MapNewsSeen {
  @Prop()
  news_id: mongoose.Types.ObjectId;

  @Prop()
  user_id: mongoose.Types.ObjectId;

  @Prop()
  device_token: string;
}

export const MapNewsSeenSchema = SchemaFactory.createForClass(MapNewsSeen);
export type MapNewsSeenDocument = MapNewsSeen & Document;
