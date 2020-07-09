import { OrmConfig, TsConfig } from '../tool/config';
import { Folder } from '../tool/fsys';
import { Route } from '../tool/arg';
import { Log } from '../tool/log';
import { Cmd } from '../tool/other/cmd';
import Chalk from 'chalk';

// Colors
const cParam = Chalk.grey
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
ormRevert.info =  `${cParam('--all   / --a      ')} → Reverts all migration from the folder.\n`
                + `${cParam('--purge / --pg / -p')} → Delete the migration/s reverted.`

ormRevert.callback = async args => {
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

  // check Folders
  if (!await fdMigr.exist) {
    throw new Error(`The Location "${fdMigr.path}" doesn\'t exists, aborting...`)
  }
  if ((await fdMigr.children).length === 0) {
    throw new Error(`The migrations folder is empty, aborting...`)
  }

  // Show info
  const all = args.paramBool('all', 'a')
  const purge = args.paramBool('purge', 'pg', 'p')
  Log.ev(
    'Revert migrations:',
    `${cParam('--all  ')} → ${cBool(all)}`,
    `${cParam('--purge')} → ${cBool(purge)}\n`
  )

  // Set Commands
  const tsc = new Cmd('tsc')
  const rev = new Cmd('npx', 'typeorm', 'migration:revert')
  
  // Compile typescript files
  Log.ev('Compiling *.ts files...')
  if (await fdDist.exist) {
    await fdDist.delete()
  }
  await tsc.execute()

  // Revert
  try {

    const desc = await fdMigr.children
    if (all) {
      // Execute command
      Log.ev('Reverting migrations:')
      for (const path of desc) {
        Log.ln(`→ ${path.name}`)
        await rev.execute()
      }
  
      // Delete Files
      if (purge) {
        console.log('')
        Log.ev('Deleting migrations:')
        for (const path of desc) {
          Log.ln(`→ ${path.name}`)
          await path.delete()
        }
      }
    } else {
      // Execute command
      const one = desc.pop()
      Log.ev(
        'Reverting migration:',
        `→ ${one.name}`
      )
      await rev.execute()
  
      // Delete File
      if (purge) {
        Log.ev(
          'Deleting migration:',
          `→ ${one.name}`
        )
        await one.delete()
      }
    }
  } catch (err) {
    console.log(err)
  }
}