import { Route } from '../tool/arg';
import { Log, Timer } from '../tool/log';

export const test = new Route()
test.main = [
  [ 'test', 't' ]
]
test.desc = 'Command for testing purposes.'
test.callback = async args => {
  Timer.start('default', '')
  Log.ev('AjajjajAJ')
  Timer.stop('default', '')
}