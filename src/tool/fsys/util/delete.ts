import * as fs from './fs-async';
import * as pt from 'path'

export function kill(path: string) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const stat = await fs.stat(path)
      if (stat.isDirectory()) {
        // Read Directory
        const paths = await fs.readDir(path)
        for (const file of paths) {
          await kill(pt.join(path, file))
        }

        // Kill Directory
        await fs.rmdir(path)
      } else {
        await fs.unlink(path)
      }

      resolve()
    } catch (err) {
      reject(err)
    }
  })
}