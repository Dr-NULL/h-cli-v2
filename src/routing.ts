import { Endpoint } from './tool/endpoint';

import { notFound } from './endpoints/not-found';
import { ormRun } from './endpoints/orm-run';
import { ormRevert } from './endpoints/orm-revert';
import { ormRebuild } from './endpoints/orm-rebuild';
import { ormGenerate } from './endpoints/orm-generate';

export const routes: Endpoint[] = [
  ormRun,
  ormRevert,
  ormRebuild,
  ormGenerate,
  notFound,
]