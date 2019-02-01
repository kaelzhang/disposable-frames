interface ISetIOptions {
  tolerance: number = 0
}

export function setImmediate (func: Function, options?: ISetIOptions): number

interface IIOptions {
  tolerance: number = 0
  maxWait: number = 0
  leading: boolean = false
}

export function immediate (func: Function, options?: IIOptions): Function
