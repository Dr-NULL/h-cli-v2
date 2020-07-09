import { Route } from '../tool/arg';
import Chalk from 'chalk';
import { Log } from '../tool/log';
import { Cmd } from '../tool/other/cmd';

// Colors
const cString = Chalk.green
const cBool = (bool: boolean) => {
  const ff = Chalk.redBright
  const tt = Chalk.blueBright

  if (bool) {
    return tt('true')
  } else {
    return ff('false')
  }
}

export const ormRevert = new Route()
ormRevert.main = [
  [ 'orm' ],
  [ 'revert', 'rev', 'rv' ]
]
ormRevert.desc = 'Reverts the migration of the project.'
ormRevert.info = ''
ormRevert.callback = async args => {
  // Get the name of 
  let name = args
    .paramValues('name', 'n')
    .reduce((prev, curr) => 
      `${prev}-${curr}`
    , '')
    .replace(/(\s|-)+/gi, '-')
    .replace(/(^-+|-+$)/gi, '')
    .replace(/^$/gi, 'NO-NAME')
  
  
  const all = args.paramBool('all', 'a')
  Log.ev(
    'Generate migration:',
    `name → ${cString('"' + name + '"')}`,
    `exec → ${cBool(all)}`
  )

  const tsc = new Cmd('tsc')
}