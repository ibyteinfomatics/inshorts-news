import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop()
  sender_type: string;

  @Prop()
  sender_id: mongoose.Types.ObjectId;

  @Prop()
  receiver_type: string;

  @Prop()
  receiver_id: mongoose.Types.ObjectId;

  @Prop()
  type: string;

  @Prop()
  action: string;

  @Prop({default:false})
  is_read: string;

  @Prop()
  title: string;

  @Prop()
  body: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
export type NotificationDocument = Notification & Document;
