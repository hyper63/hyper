import { Request } from 'node-fetch'
import connect from './connect'

globalThis.Request = Request

export default connect
