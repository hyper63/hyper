import assert from 'assert'
import { connect } from 'hyper-connect'

const hyper = connect('cloud://foo:bar@cloud.hyper.io')

async function run() {
  assert(hyper)
  console.log(hyper)

  console.log(await hyper.info.services())

  console.log('hyper-connect transpiled to Node ESM succeessfully ⚡️✅')
}

run().catch((err) => {
  assert(false, err)
})
