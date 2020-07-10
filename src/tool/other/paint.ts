import Chalk from 'chalk';

const cString = Chalk.green
const cNumber = Chalk.yellowBright
const cFunction = Chalk.hex('#2189a6')
const cSymbol = Chalk.hex('#f25ecd')
const cKey = Chalk.hex('#9494ff')
const cTrue = Chalk.blueBright
const cFalse = Chalk.redBright

export function paint(input: any) {
  switch (typeof input) {
    case 'boolean':
      if (input) {
        return cTrue('true')
      } else {
        return cFalse('false')
      }

    case 'string':
      return cString(`"${input}"`)

    case 'number':
      return cNumber(String(input))

    case 'object':
      return recursive(input)

    case 'function':
      return cFunction('[Function]')

    case 'symbol':
      return cSymbol(String(input))

    default:
      return String(input)
  }
}

function recursive(input: any) {
  let isArray = input instanceof Array
  let str = (isArray) ? '[\n' : '{\n'

  for (let key of Object.keys(input)) {
    const value = paint(input[key]).replace(/\n/gi, '\n  ')
    key = cKey((isArray) ? key : `"${key}"`)
    
    str += `  ${key}: ${value}, \n`
  }

  return str.replace(/(,\s*\n)$/gi, '\n') + ((isArray) ? ']' : '}')
}