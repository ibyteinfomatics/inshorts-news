import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop()
  title: string;

  @Prop()
  slug: string;

  @Prop({ default: 1 })
  order: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
export type CategoryDocument = Category & Document;
