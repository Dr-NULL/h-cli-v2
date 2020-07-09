import { Readable } from '../interface/readable';
import { Writable } from '../interface/writable';
import { FileBase } from '../base/file-base';
import * as fs from '../util/fs-async';

export class Json<T> extends FileBase implements Readable<T>, Writable<T>  {
  public constructor(...pathPart: string[]) {
    super(...pathPart)
  }

  public async read() {
    try {
      const bin = await fs.readFile(this.path)
      const txt = bin.toString('utf-8')
      const obj = JSON.parse(txt)
      return obj as T
    } catch (err) {
      throw err
    }
  }

  public async write(data: T) {
    try {
      const txt = JSON.stringify(data, null, '  ')
      const bin = Buffer.from(txt, 'utf-8')
      await fs.writeFile(this.path, bin)
    } catch (err) {
      throw err
    }
  }
}