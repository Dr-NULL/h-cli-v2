import { Readable, Writable } from '../interface';
import { FileBase } from '../base';
import * as fs from '../util/fs-async';

export class Txt extends FileBase implements Readable<string>, Writable<string> {
  private _encoding : BufferEncoding;
  /**
   * Get or set the encoding of the current text. The default value is `'utf-8'`
   */
  public get encoding() : BufferEncoding {
    return this._encoding;
  }
  public set encoding(v : BufferEncoding) {
    this._encoding = v;
  }

  /**
   * Create a new Instance of a Plain Text File.
   * @param pathPart Parts of the current file path. Use `'./'` or `../` at the begining to use as a relative path.
   */
  public constructor(...pathPart: string[]) {
    super(...pathPart)
    this._encoding = 'utf-8'
  }

  /**
   * Read the content of the current file.
   */
  public async read() {
    const bin = await fs.readFile(this.path)
    const txt = bin.toString(this._encoding)
    return txt
  }

  /**
   * Write the given data inside the current file.
   * @param data Text to be inserted into the current file.
   */
  public write(data: string) {
    const bin = Buffer.from(data, this._encoding)
    return fs.writeFile(this.path, bin)
  }
}