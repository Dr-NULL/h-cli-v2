import * as fs from 'fs';
import * as pt from 'path';

export function exists(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    fs.access(path, err => {
      if (err) {
        if (err.code.toUpperCase() === 'ENOENT') {
          resolve(false)
        } else {
          reject(err)
        }
      } else {
        resolve(true)
      }
    })
  })
}

export function stat(path: string) {
  return new Promise<fs.Stats>((resolve, reject) => {
    fs.stat(path, (err, stt) => {
      if (err) {
        reject(err)
      } else {
        resolve(stt)
      }
    })
  })
}

export function rmdir(path: string) {
  return new Promise<void>((resolve, reject) => {
    fs.rmdir(path, { recursive: true }, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function unlink(path: string) {
  return new Promise<void>((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function readDir(path: string) {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) {
        reject(err)
      } else {
        resolve(files)
      }
    })
  })
}

export function readFile(path: string) {
  return new Promise<Buffer>((resolve, reject) => {
    fs.readFile(path, async (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export function writeFile(path: string, data: Buffer) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function rename(oldPath: string, newPath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.rename(oldPath, newPath, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export function makePath(...pathPart: string[]) {
  return new Promise<void>((resolve, reject) => {
    const path = pt.join(...pathPart)
    fs.mkdir(path, { recursive: true }, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}