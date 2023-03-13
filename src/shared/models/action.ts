import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { ObjectId, SchemaTypes } from 'mongoose';

@Schema({
  timestamps: true,
})
export default class Action {
  public _id: ObjectId;
  public createdAt: Date;
  public updatedAt: Date;

  @Prop(String)
  serviceName: string;

  @Prop(String)
  githubSecret: string;

  @Prop({ type: [SchemaTypes.String] })
  commands: string[];
}

export const ActionSchema = SchemaFactory.createForClass(Action);
export const ActionModel = mongoose.model('action', ActionSchema);
