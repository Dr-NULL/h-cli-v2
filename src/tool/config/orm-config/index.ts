import { Config } from '../config';
import { Struct } from './struct';

export class OrmConfig extends Config<Struct[]> {
  public constructor() {
    super(null, './ormconfig.json')
  }

  async get() {
    const data: any = await super.get();
    if (data instanceof Array === false) {
      return [ data ] as Struct[]
    } else {
      return data as Struct[]
    }
  }
}