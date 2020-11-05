import type { ArtifactFiles, ArtifactObject } from 'bit-bin/dist/consumer/component/sources/artifact-files';
import type { Task } from '../build-task';
import type { StorageResolver } from '../storage';
import type { ArtifactDefinition } from './artifact-definition';

export class Artifact {
  constructor(
    /**
     * definition of the artifact.
     */
    readonly def: ArtifactDefinition,

    /**
     * storage resolver. can be used to replace where artifacts are stored.
     */
    readonly storageResolver: StorageResolver,

    readonly files: ArtifactFiles,

    /**
     * join this with `this.paths` to get the absolute paths
     */
    readonly rootDir: string,

    /**
     * the declaring task.
     * todo: change this to taskDescriptor that has only the metadata of the task, so it could be
     * saved into the model.
     */
    readonly task: Task,

    readonly taskAspectId: string,

    /**
     * timestamp of the artifact creation.
     */
    readonly timestamp: number = Date.now()
  ) {}

  get storage() {
    return this.storageResolver;
  }

  /**
   * name of the artifact.
   */
  get name(): string {
    return this.def.name;
  }

  /**
   * description of the artifact.
   */
  get description() {
    return this.def.description;
  }

  /**
   * archive all artifact files into a tar.
   */
  tar() {}

  toObject(): ArtifactObject {
    return {
      name: this.name,
      description: this.description,
      storage: this.storageResolver.name,
      task: {
        id: this.taskAspectId,
        name: this.task.name,
      },
      files: this.files,
    };
  }
}
