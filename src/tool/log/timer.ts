import { Colors } from './colors';
import { Log } from './log';

import '../proto/number-format';

interface History {
  [key: string]: number;
}

export module Timer {
  const history: History = {}

  export function start(label: string = 'default', ...text: string[]) {
    history[label] = Date.now()
    Log.write(
      Colors.type.timer,
      ' TIMER ',
      `The timer "${Colors.message.bold(label)}" has been created.`
    )

    if (text.length > 0) {
      Log.ln(...text)
    }
  }

  export function stop(label: string = 'default', ...text: string[]) {
    if (!history[label]) {
      Log.write(
        Colors.type.timer,
        ' TIMER ',
        `The timer "${Colors.message.bold(label)}" doesn't exists.`
      )
      return
    }

    // Get diff in ms
    let ms = Date.now() - history[label]
    delete history[label]

    // Get minutes
    let mm = 0
    while (ms >= 60000) {
      ms -= 60000
      mm++
    }
    
    // Get seconds
    let ss = 0
    while (ms >= 1000) {
      ms -= 1000
      ss++
    }

    Log.write(
      Colors.type.timer,
      ' TIMER ',
      `The timer "${Colors.message.bold(label)}" has ended...`,
        `Duration: `
      + `${mm.format(4)} ${Colors.message.grey('min, ')}`
      + `${ss.format(2)} ${Colors.message.grey('seg & ')}`
      + `${ms.format(3)} ${Colors.message.grey('ms')}`
    )

    if (text.length > 0) {
      Log.ln(...text)
    }
  }
}