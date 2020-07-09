import { Route } from './tool/arg';

// CMD endpoints
import { test } from './routes-cli/test';
import { help } from './routes-cli/help';
import { ormRevert } from './routes-cli/orm-revert';
import { ormGenerate } from './routes-cli/orm-generate';

export const routes: Route[] = [
  help,
  test,
  ormRevert,
  ormGenerate
]