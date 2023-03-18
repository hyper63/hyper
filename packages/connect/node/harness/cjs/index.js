const assert = require('assert')
const { connect } = require('hyper-connect')

if (!process.env['HYPER']) throw new Error('HYPER environment variable is required')

const hyper = connect(process.env.HYPER)

async function run() {
  assert(hyper)
  console.log(hyper)

  console.log(await hyper.info.services())
  console.log(await hyper.data.query({ type: 'pokemon' }, { limit: 1 }))

  console.log('hyper-connect transpiled to Node CJS succeessfully ⚡️✅')
}

run().catch((err) => {
  assert(false, err)
})
