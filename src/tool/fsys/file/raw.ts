import { FileBase } from '../base/file-base';
import { Readable } from '../interface/readable';
import * as fs from '../util/fs-async';

export class Raw extends FileBase implements Readable<Buffer> {
  public constructor(...pathPart: string[]) {
    super(...pathPart)
  }

  public read() {
    return fs.readFile(this.path) as Promise<Buffer>
  }

  public write(data: Buffer) {
    return fs.writeFile(this.path, data)
  }
}