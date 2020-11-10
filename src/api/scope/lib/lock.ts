import { loadScope, Scope } from '../../../scope';
import logger from '../../../logger/logger';
import { ScopeLock } from '../../../scope/scope-lock';

export type LockOptions = { release?: boolean };
export type LockStatus = { exists: boolean; msUntilStale?: number };

export async function lock(path: string, lockOptions: LockOptions): Promise<LockStatus> {
  logger.debug(`scope.lock started, path ${path}`);
  const scope: Scope = await loadScope(path);
  const scopeLock = new ScopeLock(scope);
  if (lockOptions.release) {
    scope.clearCache();
    scopeLock.releaseLock();
  }
  const lockData = scopeLock.getLockData();
  if (!lockData) {
    return { exists: false };
  }
  return { exists: true, msUntilStale: scopeLock.msUntilStale(lockData.timestampMs) };
}
