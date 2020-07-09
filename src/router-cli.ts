import { Route } from './tool/arg';

// CMD endpoints
import { test } from './routes-cli/test';
import { help } from './routes-cli/help';
import { ormRevert } from './routes-cli/orm-revert';

export const routes: Route[] = [
  help,
  test,
  ormRevert
]