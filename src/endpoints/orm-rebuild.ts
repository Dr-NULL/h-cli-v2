import chalk from 'chalk';
import { Endpoint } from '../tool/endpoint';
import { Log } from '../tool/log';
import { FSys } from '../fsys';
import { Cmd } from '../tool/cmd';

const cBool = (bool: boolean) => {
  const ff = chalk.redBright
  const tt = chalk.blueBright

  if (bool) {
    return tt('true')
  } else {
    return ff('false')
  }
}

export const ormRebuild = new Endpoint()
ormRebuild.cmd = [ 'orm', 'rebuild' ]
ormRebuild.callback = async args => {
  const seeds = args.find('s', 'seeds')
  Log.ev(
    'Rebuild the database:',
    `seeds → ${cBool(seeds)}`
  )

  // Folders
  const fdMigr = new FSys(true, 'src', 'migrations')
  const fdDist = new FSys(true, 'dist')
  
  // Commands
  const cmdTsc = new Cmd('tsc')
  const cmdRev = new Cmd('npx', 'typeorm', 'migration:revert')
  const cmdRun = new Cmd('npx', 'typeorm', 'migration:run')
  const cmdSee = new Cmd('npm', 'start', 'seeds')

  // Compile TypeScript
  fdDist.delete()
  await cmdTsc.execute()

  // Revert Migrations
  Log.ev('Reverting migrations...')
  for (const file of fdMigr.children.reverse()) {
    await cmdRev.execute()
  }

  // Run Migtrations
  Log.ev('Running migrations...')
  await cmdRun.execute()

  // Insert seeds
  if (seeds) {
    Log.ev('inserting seeds...')
    await cmdSee.execute()
  }

  Log.ok('The database has been successfully rebuilt.')
}
