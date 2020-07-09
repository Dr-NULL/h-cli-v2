import { FSysBase } from './fsys-base';
import { Folder } from '../folder';

export abstract class FileBase extends FSysBase {
  public get parent(): Folder {
    const path = this._path.map(x => x)
    path.pop()
    return new Folder(...path)
  }
  
  public constructor(...pathPart: string[]) {
    super(...pathPart)
  }
}