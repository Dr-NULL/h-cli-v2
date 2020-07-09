import { OrmConfig, TsConfig } from '../tool/config';
import { Route } from '../tool/arg';
import Chalk from 'chalk';
import { Folder } from '../tool/fsys';
import { Log } from '../tool/log';
import { Cmd } from '../tool/other/cmd';

const cParam = Chalk.grey
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

export const ormGenerate = new Route()
ormGenerate.main = [
  [ 'orm' ],
  [ 'generate', 'gen', 'gn' ]
]
ormGenerate.desc = 'Generate a new migration.'
ormGenerate.info =  `${cParam('--name / --nm / -n')} → Set a custom migration name.\n`
                  + `${cParam('--exec / --ex / -e')} → Execute the migration after generates it.`

ormGenerate.callback = async args => {
  // Check Project Config
  const ormConf = new OrmConfig()
  const tsConf = new TsConfig()
  if (!await ormConf.exists) {
    throw new Error('The File "ormconfig.json" doesn\'t exists, aborting...')
  }
  if (!await tsConf.exists) {
    throw new Error('The File "tsconfig.json" doesn\'t exists, aborting...')
  }

  // Get Folders
  const tsData = await tsConf.get()
  const ormData = await ormConf.get()
  const fdDist = new Folder('.', tsData.compilerOptions.outDir)
  const fdMdls = new Folder('.', ormData.cli.entitiesDir)
  if (!await fdMdls.exist) {
    throw new Error('The entities folder doesn\'t exists, aborting...')
  }
  if ((await fdMdls.children).length === 0) {
    throw new Error('The entities folder is empty, aborting...')
  }

  // Get the name of parameter
  const exec = args.paramBool('exec', 'ex', 'e')
  let name = args
    .paramValues('name', 'nm', 'n')
    .reduce((prev, curr) => 
      `${prev}-${curr}`
    , '')
    .replace(/(\s|-)+/gi, '-')
    .replace(/(^-+|-+$)/gi, '')
    .replace(/^$/gi, 'NO-NAME')
    
  // Show console info
  Log.ev(
    'Generate migrations:',
    `${cParam('--name')} → ${cString(name)}`,
    `${cParam('--exec')} → ${cBool(exec)}\n`
  )
  
  // Commands
  const tsc = new Cmd('tsc')
  const gen = new Cmd(
    'npx', 'typeorm',
    'migration:generate',
    '-n', name
  )
  const exe = new Cmd(
    'npx', 'typeorm',
    'migration:run',
  )

  // Compile *.ts files
  Log.ev('Compiling *.ts files...')
  if (!await fdDist.exist) {
    await fdDist.delete()
  }
  await tsc.execute()

  // Generate Migration
  Log.ev('Generating migration...')
  await gen.execute()
  Log.ok('Migration complete!')

  // Execute Migration
  if (exec) {
    Log.ev('Excuting migrations')
    await exe.execute()
  }
}