import { spawn } from 'child_process';
import { decode } from 'iconv-lite';
import { resolve } from 'path';

export class Cmd {
  private _encoding : string;
  public get encoding() : string {
    return this._encoding;
  }
  public set encoding(v : string) {
    this._encoding = v;
  }

  private _command : string;
  public get command() : string {
    return this._command;
  }
  public set command(v : string) {
    this._command = v;
  }
  
  private _args : string[];
  public get args() : string[] {
    return this._args;
  }
  public set args(v : string[]) {
    this._args = v;
  }
  
  private _path : string;
  public get path() : string {
    return this._path;
  }
  public set path(v : string) {
    this._path = v;
  }
  
  constructor (command: string, ...args: string[]) {
    this._encoding = 'cp850'
    this._command = command
    this._args = args
    this._path = resolve()
  }

  public execute() {
    return new Promise<string>((resolve, reject) => {
      const cmd = spawn(
        this._command,
        this._args,
        {
          cwd: this._path,
          shell: true
        }
      )
      
      let chunkOk: Uint8Array[] = []
      cmd.stdout.on('data', (chunk: Uint8Array) => {
        chunkOk.push(chunk)
      })

      let chunkError: Uint8Array[] = []
      cmd.stderr.on('data', (chunk: Uint8Array) => {
        chunkError.push(chunk)
      })
      
      cmd.on('close', (code: number) => {
        const data = Buffer.concat(chunkError)
        const text = decode(data, this._encoding)

        cmd.kill()
        if (code === 0) {
          resolve(text)
        } else {
          reject(new Error(text))
        }
      })
  
      cmd.on('error', fail => {
        reject(fail)
      })
    })
  }
}
