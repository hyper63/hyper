const { omit, keys } = require('ramda')
const zmq = require('zeromq')

const noop = () => Promise.resolve({ok: false, msg: 'Not Implemented'})

/**
 * @func
 * creates adapter for queue port
 *
 * @param {{port: string}} env
 * @returns {import('@hyper63/port-queue').QueuePort}
 */
module.exports = function (env) {
  /**
   * @type {{[key:string]: { name: string, target: string, secret?: string}}}
   */
  let queues = {}
  // setup worker
  worker(env.port)
  
  const sock = new zmq.Push
  sock.bind(`tcp://127.0.0.1:${env.port}`)

  return {
    /**
     * @returns {Promise<string[]>}
    */
    index: () => {
      return Promise.resolve(Object.keys(queues))
    },
    /**
     * @param {import('@hyper63/port-queue').QueueCreateInput} input 
     */
    create: (input) => {
      queues[input.name] = input 
      return Promise.resolve({ok: true})
    },
    /**
     * @param {string} name
     */
    'delete': (name) => {
      queues = omit([name], queues)
      return Promise.resolve({ok: true})
    },
    /**
     * @param {import('@hyper63/port-queue').QueuePostInput} input
     */
    post: async (input) => {
      const q = queues[input.name]
      // setup producer
      await producer(sock, q.target, input.job)
      return Promise.resolve({ok: true})
    },
    get: noop,
    cancel: noop,
    retry: noop 

  }
}

/**
 * @param {string} port
 */
async function worker(port) {
  const sock = new zmq.Pull
  sock.connect(`tcp://127.0.0.1:${port}`)
  
  for await (const [msg] of sock) {
    const job = JSON.parse(msg.toString())
    await fetch(job.target, { method: 'POST', headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(job.data)
    }).then(res => res.json())
      .then(res => console.log(JSON.stringify(res)))
      .catch(err => console.log(err.message))
  }
}

/**
 * @param {import('zeromq').Push} sock
 * @param {string} target
 * @param {{[key: string]: any}} job
 */
async function producer(sock, target, job) {
  //const sock = new zmq.Push
  //await sock.bind(`tcp://127.0.0.1:${port}`)
    
  return sock.send(JSON.stringify({target, data: job})).then(() => ({ok: true})) 
}

