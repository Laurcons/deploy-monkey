import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export default class Service {
  public _id: ObjectId;
  public createdAt: Date;
  public updatedAt: Date;

  @Prop(String)
  name: string;

  @Prop(String)
  githubSecret: string;

  @Prop({ type: [SchemaTypes.String] })
  commands: string[];

  @Prop({ type: [SchemaTypes.String] })
  conditions: string[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
export type ServiceDocument = Service & Document;
export const ServiceModel = mongoose.model('action', ServiceSchema);
