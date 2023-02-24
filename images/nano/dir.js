import { join } from './deps.js'

export const DIR = join('.', '__hyper__')

export async function reload(purge = false) {
  if (purge) {
    console.log('destroying all hyper services in hyper nano...')
    await remove()
  }
  await create()
}

export async function create() {
  try {
    return await Deno.mkdir(DIR, { recursive: true })
  } catch (err) {
    if (err instanceof Deno.errors.AlreadyExists) {
      // already exists so return
      return true
    } else {
      // unexpected error, maybe permissions, pass it along
      throw err
    }
  }
}

async function remove() {
  return await Deno.remove(DIR, { recursive: true })
}
