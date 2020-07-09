import { Config } from '../config';
import { Struct } from './struct';

export class OrmConfig extends Config<Struct> {
  public constructor() {
    super(null, './ormconfig.json')
  }
}