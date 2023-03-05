import { main } from './main.ts'
import type { HyperServices } from './types.ts'

export default async function (services: HyperServices) {
  const port = parseInt(Deno.env.get('PORT') || '6363')
  const app = main(services)

  await new Promise<void>((resolve) => app.listen(port, () => resolve()))

  return app
}
