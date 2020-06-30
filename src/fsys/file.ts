import { FSys } from ".";

export class File extends FSys {
  public constructor(relative: boolean, ...pathSegments: string[]) {
    super(relative, ...pathSegments)
  }
}