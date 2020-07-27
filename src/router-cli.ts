import { Route } from './tool/arg';

// CMD endpoints
import { test } from './routes-cli/test';
import { help } from './routes-cli/help';
import { ormRevert } from './routes-cli/orm-revert';
import { ormExecute } from './routes-cli/orm-execute';
import { ormGenerate } from './routes-cli/orm-generate';
import { ormRebuild } from './routes-cli/orm-rebuild';

export const routes: Route[] = [
  help,
  // test,
  ormRevert,
  ormExecute,
  ormGenerate,
  ormRebuild
]