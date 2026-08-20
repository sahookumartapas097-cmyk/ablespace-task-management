import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({
    required: true,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo',
  })
  status!: string;

  @Prop({
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium',
  })
  priority!: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);