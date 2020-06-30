import { Endpoint } from '../tool/endpoint';
import { Log } from '../tool/log';
import { Cmd } from '../tool/cmd';
import { FSys } from '../fsys';

import chalk from 'chalk';
import { resolve } from 'path';

const cBool = (bool: boolean) => {
  const ff = chalk.redBright
  const tt = chalk.blueBright

  if (bool) {
    return tt('true')
  } else {
    return ff('false')
  }
}

export const ormRevert = new Endpoint()
ormRevert.cmd = [ 'orm', 'revert' ]
ormRevert.callback = async args => {
  const all = args.find('a', 'all')
  const purge = args.find('p', 'pg', 'purge')

  Log.ev(
    'Reverting migrations:',
    `all   → ${cBool(all)}`,
    `purge → ${cBool(purge)}`
  )

  // Instanciar directorios
  const fdDist = new FSys(true, 'dist')
  const fdMigr = new FSys(true, 'src/migrations')

  // Count migrations amount
  if (fdMigr.children.length === 0) {
    throw new Error("Nothing migrations to revert.")
  }
  
  // Recompilar Typescript
  fdDist.delete()
  const tsc = new Cmd('tsc')
  await tsc.execute()

  // Revertir migraciones
  const rev = new Cmd('npx', 'typeorm', 'migration:revert')
  let i = 0
  if (all) {
    for (const file of fdMigr.children.reverse()) {
      await rev.execute()
      i++

      // Delete File
      if (file.type === 'file' && purge) {
        file.delete()
      }
    }
  } else {
    await rev.execute()
    i++

    // Delete File
    if (purge) {
      const file = fdMigr.children.pop()
      if (file) {
        file.delete()
      }
    }
  }

  Log.ok(
    `Reverted ${chalk.yellow(i)} migrations.`
  )
}