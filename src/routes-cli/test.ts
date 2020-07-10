import { Route } from '../tool/arg';
import { paint } from '../tool/other/paint';
import { Log } from '../tool/log';

export const test = new Route()
test.main = [
  [ 'test', 't' ]
]
test.desc = 'Command for testing purposes.'
test.callback = async args => {
  const ref = [
    16516,
    513513,
    151351,
    {
      text: 'joder',
      value: 165135
    },
    {
      text: 'Nya!',
      value: 555
    }
  ]

 Log.ln(paint(ref))
}