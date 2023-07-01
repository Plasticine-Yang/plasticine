import type { ILogger } from '@plasticine/types'

class Logger implements ILogger {
  private scope: string
  private sharedPrefix: string

  constructor(scope: string) {
    this.scope = scope
    this.sharedPrefix = this.generateSharedPrefix()
  }

  public info(message?: any, ...optionalParams: any[]): void {
    console.log(this.sharedPrefix, message, ...optionalParams)
  }

  public warn(message?: any, ...optionalParams: any[]): void {
    console.warn(this.sharedPrefix, message, ...optionalParams)
  }

  public error(message?: any, ...optionalParams: any[]): void {
    console.error(this.sharedPrefix, message, ...optionalParams)
  }

  private generateSharedPrefix(): string {
    return `[${this.scope}]`
  }
}

export { Logger }
