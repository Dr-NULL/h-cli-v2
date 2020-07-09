import { parsePath } from '../util/parse-path';
import { EmptyPath } from '../error/empty-path';
import { kill } from '../util/delete';
import * as path from 'path';
import * as fs from 'fs';
import { exists, rename } from '../util/fs-async';

export abstract class FSysBase {
  protected _path: string[];

  /**
   * Get or set the absolute path.
   */
  public get path(): string {
    return path.join(...this._path)
  }
  public set path(v: string) {
    this._path = parsePath([v])
  }

  /**
   * Get the element name.
   */
  public get name(): string {
    const i = this._path.length - 1
    return this._path[i]
  }

  /**
   * Check if the current element exists.
   */
  public get exist() {
    return exists(this.path)
  }

  /**
   * Create a new FSys instance.
   * @param paths Part of the current path. Use `'./'` or `'../'` at the beginning for define a relative path.
   */
  public constructor(...paths: string[]) {
    this._path = parsePath(paths)
  }

  public async resolve(...paths: string[]) {
    // Throw Error
    if (paths.length === 0) {
      throw new EmptyPath()
    }

    // Chech relative
    const oldPath = this.path
    if (paths[0].match(/^\.{1,2}((\\|\/)|$)/gi)) {
      const curr = this._path.map(x => x)
      curr.push(...paths)
      this.path = path.join(...curr)
    } else {
      this.path = path.join(...paths)
    }

    // Move element
    await rename(oldPath, this.path)
  }
  
  /**
   * Delete the current path recursively.
   */
  public async delete() {
    return kill(this.path)
  }
}