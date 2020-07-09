import { routes } from '../router-cli';
import { Route } from '../tool/arg';
import { Log } from '../tool/log';
import chalk from 'chalk';

interface Details {
  cmd: string;
  txt: string; 
}

const cCyan = chalk.bgCyan.white
const cCode = chalk.bgGrey.white.bold

export const help = new Route()
help.main = [
  [ 'help', 'h' ]
]
help.desc = 'Give information about the commands available.'
help.info = `For get all available commands, type ${cCode('h. help')}.\n`
          + `Instead, for detailed info, type ${cCode('h. help --cmd [name]')}, \n`
          + 'where the [name] it\'s the desired command\'s documentation.'
help.callback = args => {
  const query = args.paramValues('command', 'cmd', 'c')
  
  if (query.length === 0) {
    const details: Details[] = []
    let maxLength = 0
    
    // Show intro
    Log.write(
      cCyan,
      ' INFO! ',
      'This is a simple ORM CLI for makes the migration process more simple. ',
      'The available commands are:\n'
    )
    
    // Capture all commands
    for (const route of routes) {
      // Build command text
      let cmd = ''
      for (const main of route.main) {
        let curr = (main[0]) ? main[0].trim() : '{ empty }'
        cmd += ` ${(curr) ? curr : '{ empty }'}`
      }

      // Set new max length
      cmd = cmd.trim()
      if (cmd.length > maxLength) {
        maxLength = cmd.length
      }

      // Add new Item
      details.push({
        cmd: cmd,
        txt: route.desc
      })
    }

    // Show to the console
    for (const detail of details) {
      while (detail.cmd.length < maxLength) {
        detail.cmd += ' '
      }
      Log.ln(`${cCode(detail.cmd)} → ${detail.txt}`)
    }

    // Show an aditional option
    Log.ln(
      '\nFor get detailed info about a command, type ',
      `${cCode('help --cmd [command]')}, where [command] will be `,
      'any of the commands displayed above.\n'
    )
  } else {
    // Error declaration
    const cmd = query
      .reduce((prev, curr) => `${prev} ${curr}`, '')
      .trim()
    const error = new Error(
        `The command ${cCode(cmd)} doesn't exists.\n`
      + `Use the ${cCode('h. help')} for more information.`
    )

    // Deep search
    let found: Route
    for (const route of routes) {
      if (route.main.length !== query.length) {
        continue
      }

      found = route
      for (let i = 0; i < query.length; i++) {
        if (!route.main[i].find(x => x === query[i])) {
          found = null
          break
        }
      }
      if (!found) {
        continue
      } else {
        break
      }
    }

    if (!found) {
      throw error
    } else if (!found.info) {
      found.info = 'Information not specified.'
    }

    // Show Details
    Log.write(
      cCyan,
      ' INFO! ',
      `Command ${cCode(cmd)}:`,
      '----------------------------------------------',
      found.desc +'\n',
      'Details:',
      '----------------------------------------------',
      found.info + '\n'
    )
  }
}