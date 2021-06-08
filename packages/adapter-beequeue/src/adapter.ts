import {
  QueuePort, QueueCreateInput, QueuePostInput, QueueResponse,
  QueueGetInput, JobsResponse, JobInput
} from '@hyper63/port-queue'
import { omit } from 'ramda'

import { Config } from './types'
import Queue from 'bee-queue'

export default function (env: Config) : QueuePort {
  let queues : {[key: string] : Queue} = {}
  return {
    index: () : Promise<string[]> => Promise.resolve(Object.keys(queues)),
    create: ({ name, target }: QueueCreateInput): Promise<QueueResponse> => {
      const q = new Queue(name, { redis: env.redis })
      q.on('succeeded', (job : any, result: any) => {
        console.log(`Job ${job.id} succeeded with result: ${JSON.stringify(result)}`)
      })
      q.on('failed', (job: any, err: any) => {
        console.log(`Job ${job.id} failed with error ${err.message}`)
      })
      q.process(async (job: any) => {
        // fetch is pulled from environment
        // eslint-disable-next-line no-undef
        return await fetch(target, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(job.data)
        })
          .then(res => {
            if (res.status > 300) {
              throw new Error('Job Failed')
            }
            return res.json()
          })
      })

      queues[name] = q
      return Promise.resolve({ ok: true })
    },
    post: (input: QueuePostInput): Promise<QueueResponse> => {
      const q = queues[input.name]
      const job = q.createJob(input.job)
      job.save()
      return Promise.resolve({ ok: true })
    },
    delete: (name: string): Promise<QueueResponse> => {
      const q = queues[name]
      queues = omit([name], queues)
      return q.destroy().then(() => ({ ok: true }))
    },
    get: (input: QueueGetInput): Promise<JobsResponse> => {
      return queues[input.name].getJobs(input.status === 'READY' ? 'waiting' : 'failed', { start: 0, end: 25 })
        .then(jobs => ({ ok: true, jobs }))
    },
    cancel: (input: JobInput): Promise<QueueResponse> => {
      const q = queues[input.name]
      return q.removeJob(input.id).then(() => ({ ok: true }))
    },
    retry: (input: JobInput): Promise<QueueResponse> => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const q = queues[input.name]
      return Promise.resolve({ ok: true })
    }
  }
}
