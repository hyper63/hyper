import { Colors } from './deps.js'

export const log = console.log

export const success = (text) => console.log(Colors.green(text))
export const info = (text) => console.log(`${Colors.blue('[INFO]')} ${text}`)
export const warn = (text) => console.log(`${Colors.yellow('[WARN]')} ${text}`)
export const error = (text) => console.log(`${Colors.red('[ERROR]')} ${text}`)
