export class Counter {
  private state: DurableObjectState
  private value: number
  private initializePromise: undefined | Promise<void>

  constructor(state: DurableObjectState, env: Environment) {
    this.state = state
    this.value = 0
    this.initializePromise = undefined
  }

  async initialize() {
    let stored = (await this.state.storage.get('value')) as number
    this.value = stored || 0
  }

  async fetch(request: Request) {
    if (!this.initializePromise) {
      this.initializePromise = this.initialize().catch((err) => {
        this.initializePromise = undefined
        throw err
      })
    }
    await this.initializePromise

    // Apply requested action.
    let url = new URL(request.url)
    console.log('URL', url)
    let currentValue = this.value
    switch (url.pathname) {
      case '/increment':
        currentValue = ++this.value
        await this.state.storage.put('value', this.value)
        break
      case '/decrement':
        currentValue = --this.value
        await this.state.storage.put('value', this.value)
        break
      case '/':
        break
      default:
        return new Response('Not found', { status: 404 })
    }
    return new Response(currentValue.toString())
  }
}
