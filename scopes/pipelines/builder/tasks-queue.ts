import { EnvDefinition } from '@teambit/envs';
import { Task, TaskWrapper } from './build-task';
import { InvalidTask } from './exceptions';

type EnvTask = { env: EnvDefinition; taskWrapper: TaskWrapper };

export class TasksQueue extends Array<EnvTask> {
  toString() {
    return this.map(({ env, taskWrapper }) => `env ${env.id}, task ${taskWrapper.id}`).join('\n');
  }
  /**
   * make sure tasks names are valid and there are no duplications
   */
  validate() {
    this.forEach(({ taskWrapper }) => {
      this.validateTaskName(taskWrapper.task);
    });
    this.validateDuplications();
  }

  private validateTaskName(task: Task) {
    if (!task.name) throw new InvalidTask(task.aspectId, 'name is missing');
    const regexWord = /^\w+$/; // match any word: a-zA-Z0-9 and underscore.
    const isValid = regexWord.test(task.name);
    if (!isValid)
      throw new InvalidTask(task.aspectId, `name "${task.name}" is invalid, only alphanumeric characters are allowed`);
  }

  private validateDuplications() {
    const uniqueTasks = this.map(
      ({ env, taskWrapper }) => `${env.id} ${taskWrapper.aspectId}:${taskWrapper.task.name}`
    );
    uniqueTasks.forEach((uniqTask) => {
      if (uniqueTasks.filter((u) => u === uniqTask).length > 1) {
        throw new InvalidTask(
          uniqTask,
          'there are two or more tasks with the same name and aspectId in the same environment'
        );
      }
    });
  }
}
