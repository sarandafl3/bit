import path from 'path';
import fs from 'fs-extra';
import { Scope } from '.';

export type LockData = { timestampMs: number };
const LOCK_FILE = '.lock';
const LOCK_STALE_IN_MS = 1000 * 60 * 15;
const NUM_OF_RETRIES = 5;
const WAIT_BEFORE_RETRY_IN_MS = 200;

export class ScopeLock {
  constructor(private scope: Scope) {}
  get lockPath() {
    return path.join(this.scope.getPath(), LOCK_FILE);
  }
  getLockData(): LockData | null {
    try {
      const stat = fs.statSync(this.lockPath);
      return { timestampMs: stat.ctimeMs };
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
      return null;
    }
  }
  async createLock() {
    await this.waitForLockIfExist();
    await fs.outputFile(this.lockPath, '');
  }
  async waitForLockIfExist() {
    let isLockCleared = this.clearLockIfStale();
    if (isLockCleared) {
      return;
    }
    for (let i = 0; i < NUM_OF_RETRIES; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await this.sleep(WAIT_BEFORE_RETRY_IN_MS);
      isLockCleared = this.clearLockIfStale();
      if (isLockCleared) {
        break;
      }
    }
    throw new Error(`SCOPE IS LOCKED. WILL BE RELEASED SOON`);
  }
  releaseLock() {
    fs.removeSync(this.lockPath);
  }
  /**
   * milliseconds left until the lock file is considered stale.
   * negative result indicates stale lock
   */
  msUntilStale(lockCreated: number): number {
    const msSinceCreatedInMs = Date.now() - lockCreated;
    return LOCK_STALE_IN_MS - msSinceCreatedInMs;
  }
  /**
   * returns true if the lock is cleared or not exists.
   * returns false when the lock is active.
   * (this function violates CQS, I didn't find a better way).
   */
  private clearLockIfStale(): boolean {
    const lockData = this.getLockData();
    if (!lockData) {
      return true;
    }
    if (this.isStale(lockData.timestampMs as number)) {
      this.scope.clearCache();
      this.releaseLock();
      return true;
    }
    return false;
  }
  private isStale(lockCreated: number): boolean {
    const msUntilStale = this.msUntilStale(lockCreated);
    return msUntilStale < 0;
  }
  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
