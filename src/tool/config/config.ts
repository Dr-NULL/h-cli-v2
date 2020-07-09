import { File } from '../fsys';

export abstract class Config<T> {
  private _init: T;
  private _json: File.Json<T>

  /**
   * Get the name of the current configuration file.
   */
  public get name() {
    return this._json.name
  }
  
  /**
   * Get if the current configuration file exists.
   */
  public get exists() {
    return this._json.exist;
  }

  /**
   * Set a new config class, extend this class for make your custom config *.json file passing an interface as a type parameter.
   * @param init Default Values for the current Class.
   * @param pathPart Path parts of the current file. Use `'./'` or `'../'` for relative paths.
   */
  constructor(init: T, ...pathPart: string[]) {
    this._json = new File.Json<T>(...pathPart)
    this._init = init
  }
  
  /**
   * Get the current data into the file config. If the file doesn't exist, a new copy will be created, and returns the default values.
   */
  public async get() {
    if (await this._json.exist) {
      return this._json.read()
    } else {
      await this._json.write(this._init)
      return this._init
    }
  }

  /**
   * Set the data of this configuration file. If that file doesn't exists, a new file config will be created.
   * @param v Data to save into the current config file.
   */
  public set(v: T) {
    return this._json.write(v)
  }
}