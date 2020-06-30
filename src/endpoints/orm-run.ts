import { Endpoint } from '../tool/endpoint';
import { Log } from '../tool/log';
import { FSys } from '../fsys';
import { Cmd } from '../tool/cmd';

export const ormRun = new Endpoint()
ormRun.cmd = [ 'orm', 'run' ]
ormRun.callback = async args => {
  Log.ev('Run migrations...')

  const fdDist = new FSys(true, 'dist')
  const cmdTsc = new Cmd('tsc')
  const cmdRun = new Cmd('npx', 'typeorm', 'migration:run')
  
  fdDist.delete()
  await cmdTsc.execute()
  await cmdRun.execute()

  Log.ok('The migrations has been successfully executed.')
}
