import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsIn(['Todo', 'In Progress', 'Done'])
  status!: string;

  @IsIn(['Low', 'Medium', 'High'])
  priority!: string;
}