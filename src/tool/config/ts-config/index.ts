import { Config } from '../config';
import { Struct } from './struct';

export class TsConfig extends Config<Struct> {
  public constructor() {
    super(null, './tsconfig.json')
  }
}