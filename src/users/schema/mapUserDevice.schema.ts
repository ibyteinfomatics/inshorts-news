import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class MapUserDevice {
  @Prop({ enum: ['ios', 'android'] })
  device_type: string;

  @Prop({ default: null })
  user_id: mongoose.Types.ObjectId;

  @Prop({ default: null })
  device_token: string;

  @Prop()
  device_id: string;
}

export const MapUserDeviceSchema = SchemaFactory.createForClass(MapUserDevice);
export type MapUserDeviceDocument = MapUserDevice & Document;
