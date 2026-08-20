import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name)
    private readonly taskModel: Model<Task>,
  ) {}

  // CREATE
  async create(
    createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    const task = new this.taskModel(
      createTaskDto,
    );

    return task.save();
  }

  // GET ALL
  async findAll(): Promise<Task[]> {
    return this.taskModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
  }

  // GET ONE
  async findOne(id: string): Promise<Task> {
    const task =
      await this.taskModel.findById(id).exec();

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  // UPDATE
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task =
      await this.taskModel.findByIdAndUpdate(
        id,
        updateTaskDto,
        {
          new: true,
          runValidators: true,
        },
      ).exec();

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return task;
  }

  // DELETE
  async remove(
    id: string,
  ): Promise<{ message: string }> {
    const task =
      await this.taskModel.findByIdAndDelete(id).exec();

    if (!task) {
      throw new NotFoundException(
        `Task with ID ${id} not found`,
      );
    }

    return {
      message: 'Task deleted successfully',
    };
  }
}