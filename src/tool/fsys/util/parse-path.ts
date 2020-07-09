import { join, resolve } from 'path';
import { EmptyPath } from '../error';

export function parsePath(pathPart: string[]) {
  if (pathPart.length === 0) {
    throw new EmptyPath()
  }

  let raw: string;
  if (pathPart[0].match(/^\.{1,2}((\\|\/)|$)/gi)) {
    raw = resolve(...pathPart)
  } else {
    raw = join(...pathPart)
  }
  
  const out = raw
    .replace(/\\/gi, '/')
    .split(/\//gi)

  return out
}