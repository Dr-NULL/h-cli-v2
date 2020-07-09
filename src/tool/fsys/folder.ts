import { FileBase } from './base/file-base';
import * as fs from './util/fs-async';
import { Raw } from './file/raw';
import { join } from 'path';

export class Folder extends FileBase {
  public get children() {
    return new Promise<(Folder|Raw)[]>(async (resolve, reject) => {
      try {
        const paths = await fs.readDir(this.path)
        const out: (Folder|Raw)[] = []
        for (const path of paths) {
          // Normalize Path
          const arrPath = this._path.map(x => x)
          arrPath.push(path)
          const thePath = join(...arrPath)

          // Get File info
          const info = await fs.stat(thePath)
          if (info.isDirectory()) {
            out.push(new Folder(thePath))
          } else if (info.isFile()) {
            out.push(new Raw(thePath))
          }
        }

        resolve(out)
      } catch (err) {
        reject(err)
      }
    })
  }

  /**
   * Create a new folder instance.
   * @param pathPart Part of the current path. Use `'./'` or `'../'` at the beginning for define a relative path.
   */
  public constructor(...pathPart: string[]) {
    super(...pathPart)
  }

  /**
   * Create the current instance's path.
   */
  public make() {
    return fs.makePath(...this._path)
  }
}