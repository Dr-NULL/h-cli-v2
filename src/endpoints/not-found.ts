import { Endpoint } from '../tool/endpoint';
import { Log } from '../tool/log';
import chalk from 'chalk';

export const notFound = new Endpoint()
notFound.cmd = []
notFound.props = []
notFound.callback = args => {
  const code = chalk
    .bgHex('#252525')
    .hex("a1a1a1")

  Log.er(
    'Command not found. For list all available',
    `commands, type in the shell ${code('h. help')}.`
  )
}