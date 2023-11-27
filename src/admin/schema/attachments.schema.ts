import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Attachment {
  @Prop()
  news_id: string;

  @Prop()
  user_idz: string;

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
