#!/usr/bin/env node
import { routes } from './router-cli';
import { Router } from './tool/arg';
import { Log } from './tool/log';
import { NotFound } from './tool/arg/error';
import Chalk from 'chalk';

// Callback for success execution
const success = () => {
  Log.ok('Execution Completed.')
}

// Callback for failed execution
const failed = (err: any) => {
  if (err instanceof NotFound) {
    Log.er(
        err.message + ' Type '
      + Chalk.bgGrey.white.bold('"h. help"')
      + '\nfor get the available commands.\n'
    )
  } else {
    Log.er(err.message, '')
  }
}

// Execute the program
Log.title('H. CLI', '0.0.3')
Router.read(routes)
  .then(success)
  .catch(failed)
