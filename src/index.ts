// In order for the workers runtime to find the class that implements
// our Durable Object namespace, we must export it from the root module.
// export { Counter } from './counter'

const isEven = (n: number) => n % 2 === 0

const handler: CFWorker = {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env)
    } catch (e) {
      return new Response(e.message)
    }
  },
}

const handleRequest: Fetch = async (request, env) => {
  // const id = env.COUNTER.idFromName('A')
  // const obj = env.COUNTER.get(id)
  // const resp = await obj.fetch(request.url)
  // const count = parseInt(await resp.text(), 10)
  const count = 10
  const wasOdd = isEven(count) ? 'is even' : 'is odd'

  return new Response(
    JSON.stringify({ message: `${count} ${wasOdd}`, count }),
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    },
  )
}

export default handler
