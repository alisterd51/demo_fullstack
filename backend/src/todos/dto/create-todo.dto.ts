export class CreateTodoDto {
  readonly id: number = 0;
  readonly title: string = '';
  readonly done: boolean = false;
  readonly description?: string;
}