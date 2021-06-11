export {}

declare global {
  type Fetch = (request: Request, env: Environment) => Promise<Response>

  interface Environment extends Record<string, unknown> {
    COUNTER: DurableObjectNamespace
  }

  interface CFWorker {
    fetch: Fetch
  }
}
