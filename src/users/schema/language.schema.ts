import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class MapUserLanguage {
  @Prop()
  title: string;

  @Prop()
  slug: string;
}

export const MapUserLanguageSchema =
  SchemaFactory.createForClass(MapUserLanguage);
export type MapUserLanguageDocument = MapUserLanguage & Document;
