export class EmptyPath extends Error {
  public readonly name: string = 'empty-path';
  
  public constructor() {
    super('Assign an empty path it\'s not valid.')
  }
}