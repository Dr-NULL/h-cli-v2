import chalk from 'chalk';
import { Endpoint } from '../tool/endpoint';
import { Log } from '../tool/log';
import { Cmd } from '../tool/cmd';
import { FSys } from '../fsys';

const cBool = (bool: boolean) => {
  const ff = chalk.redBright
  const tt = chalk.blueBright

  if (bool) {
    return tt('true')
  } else {
    return ff('false')
  }
}

export const ormGenerate = new Endpoint()
ormGenerate.cmd = [ 'orm', 'generate' ]
ormGenerate.callback = async args => {
  const exec = args.find('e', 'exec')
  let name = args
    .findValue('n', 'name')
    .reduce((prev, curr, i) => {
      if (i > 0) {
        prev += ' '
      }
      return prev + curr
    }, '')

  // Validate migration name
  if (!name) {
    name = 'NO NAME'
  } else {
    name = name.replace(/[^0-9a-z\s\-_]/gi, '')
    name = name.trim()

    if (name.length === 0) {
      name = 'NO NAME'
    }
  }
  name = name.replace(/\s+/gi, '-')

  // Console message
  const cString = chalk.green
  Log.ev(
    'Generate migration:',
    `name → ${cString('"' + name + '"')}`,
    `exec → ${cBool(exec)}`
  )

  // Compile TS
  const fdDist = new FSys(true, 'dist')
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

  fdDist.delete()
  await tsc.execute()
  await gen.execute()

  if (exec) {
    Log.ev(
      'Migration generated sucessfully...',
      'executing migration...'
    )

    await exe.execute()
    Log.ok('Migration generated and execute succesfully.')
  } else {
    Log.ok('Migration generated successfully.')
  }
}