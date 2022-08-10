import { Injectable, NotFoundException } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './interfaces/todo.interface';

@Injectable()
export class TodosService {
  todos: Todo[] = [
    {
      id: 1,
      title: 'todos app',
      done: false,
      description: 'Create NestJS todos app'
    },
    {
      id: 2,
      title: 'bread',
      done: true,
      description: 'buy bread'
    },
    {
      id: 3,
      title: 'wine',
      done: true,
      description: 'buy wine'
    }
  ];

  findOne(id: string) {
    return this.todos.find(todo => todo.id === Number(id));
  }

  findAll(): Todo[] {
    return this.todos;
  }

  create(todo: CreateTodoDto) {
    this.todos = [...this.todos, todo];
  }

  update(id: string, todo: Todo) {
    const todoToUpdate = this.todos.find(todo => todo.id === Number(id));
    if (!todoToUpdate) {
      return new NotFoundException('booo did you find this todo');
    }
    if (todo.hasOwnProperty('done')) {
      todoToUpdate.done = todo.done;
    }
    if (todo.hasOwnProperty('title')) {
      todoToUpdate.title = todo.title;
    }
    if (todo.hasOwnProperty('description')) {
      todoToUpdate.description = todo.description;
    }
    const updateTodos = this.todos.map(todo => todo.id !== Number(id) ? todo : todoToUpdate);
    this.todos = [...updateTodos];
    return { updateTodos: 1, todo: todoToUpdate };
  }

  delete(id: string) {
    const nbOfTodosBeforeDelete = this.todos.length;
    this.todos = [...this.todos.filter(todo => todo.id !== Number(id))];
    if (this.todos.length < nbOfTodosBeforeDelete) {
      return { deletedTodos: 1, nbOfTodos: this.todos.length };
    } else {
      return { deletedTodos: 0, nbOfTodos: this.todos.length };
    }
  }
}
