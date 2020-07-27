import { paint } from '../tool/other/paint';
import { Route } from '../tool/arg';
import { Log } from '../tool/log';
import { Cmd } from '../tool/other/cmd';
import Chalk from 'chalk';
import { Folder } from '../tool/fsys';
import { OrmConfig, TsConfig } from '../tool/config';


export const ormRebuild = new Route()
ormRebuild.main = [
  [ 'orm' ],
  [ 'rebuild', 'reb', 'rb' ]
]
ormRebuild.desc = 'Revert all migrations, and execute them again.'
ormRebuild.info = `${Chalk.grey('--purge/--pg/--p')}   → Deletes all current migrations, and create a new migration.\n`
                + `${Chalk.grey('--seeds/--sd/--s')}   → Execute "node ./dist/ seeds" after rebuild.`
ormRebuild.callback = async args => {
  // Check config
  const ormConf = new OrmConfig()
  const tsConf = new TsConfig()
  if (!await ormConf.exists) {
    throw new Error('The File "ormconfig.json" doesn\'t exists, aborting...')
  }
  if (!await tsConf.exists) {
    throw new Error('The File "tsconfig.json" doesn\'t exists, aborting...')
  }

  // Get Paths
  const jsonOrm = await ormConf.get()
  const jsonTs = await tsConf.get()
  const fdMigr = new Folder('.', jsonOrm.cli.migrationsDir)
  const fdDist = new Folder('.', jsonTs.compilerOptions.outDir)
  
  // Check parameters
  const purgeAll = args.paramBool('purge', 'pg', 'p')
  const execSeed = args.paramBool('seeds', 'sd', 's')
  const cmdTsc = new Cmd('tsc')
  const cmdRev = new Cmd('npx', 'typeorm', 'migration:revert')
  const cmdGen = new Cmd('npx', 'typeorm', 'migration:generate', '-n', 'NO-NAME')
  const cmdExe = new Cmd('npx', 'typeorm', 'migration:run')
  const cmdSee = new Cmd('node', './dist', 'seeds')
  
  Log.ev('Rebuild the Database:')
  Log.ln(`${Chalk.grey('--purge')} = ${paint(purgeAll)}`)
  Log.ln(`${Chalk.grey('--seeds')} = ${paint(execSeed)}\n`)

  Log.ev('Reverting all...')
  if (await fdDist.exist) {
    await fdDist.delete()
  }
  await cmdTsc.execute()
  for (const child of await fdMigr.children) {
    await cmdRev.execute()
  }

  Log.ev('Deleting all...')
  if (purgeAll) {
    await fdMigr.delete()
  }

  await fdDist.delete()
  await cmdTsc.execute()
  if (purgeAll) {
    Log.ev('Generate migration...')
    await cmdGen.execute()
  }
  
  Log.ev('Executing migration...')
  await cmdExe.execute()

  // Add Seeds
  if (execSeed) {
    Log.ev('Load Seeds...')
    await cmdSee.execute()
  }
}