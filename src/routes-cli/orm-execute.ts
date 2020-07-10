import { TsConfig, OrmConfig } from '../tool/config';
import { Folder } from '../tool/fsys';
import { Route } from '../tool/arg';
import Chalk from 'chalk';
import { Cmd } from '../tool/other/cmd';
import { Log } from '../tool/log';

const cParam = Chalk.grey
export const ormExecute = new Route()
ormExecute.main = [
  [ 'orm' ],
  [ 'execute', 'exec', 'exe', 'ex' ]
]

ormExecute.desc = 'Execute all migrations pendings.'
ormExecute.callback = async args => {
  // Check Project Config
  const ormConf = new OrmConfig()
  const tsConf = new TsConfig()
  if (!await ormConf.exists) {
    throw new Error('The File "ormconfig.json" doesn\'t exists, aborting...')
  }
  if (!await tsConf.exists) {
    throw new Error('The File "tsconfig.json" doesn\'t exists, aborting...')
  }

  // Check folders
  const dataOrm = await ormConf.get()
  const dataTs = await tsConf.get()
  const fdMigr = new Folder('.', dataOrm.cli.migrationsDir)
  const fdDist = new Folder('.', dataTs.compilerOptions.outDir)
  if (!await fdMigr.exist) {
    throw new Error('The Migration Folder doesn\'t exist, aborting...')
  } else if ((await fdMigr.children).length === 0) {
    throw new Error('The Migration Folder is empty, aborting...')
  }

  // Execute commands
  const tsc = new Cmd('tsc')
  const exe = new Cmd(
    'npx', 'typeorm',
    'migration:run',
  )

  if (await fdDist.exist) {
    await fdDist.delete()
  }
  Log.ev('Excuting migrations')
  await exe.execute()
}