import crocks from 'crocks'
import { assoc, map } from 'ramda'
import { $fetch } from '../lib/utils.js'
import { assert, assertEquals } from 'asserts'

const { Async } = crocks
const test = Deno.test

const docs = [
  { _id: '1001', type: 'movie', title: 'Ghostbusters' },
  { _id: '1002', type: 'movie', title: 'Ghostbusters 2' },
  { _id: '1003', type: 'movie', title: 'Groundhog Day' },
  { _id: '1004', type: 'movie', title: 'Scrooged' },
  { _id: '1005', type: 'movie', title: 'Caddyshack' },
  { _id: '1006', type: 'movie', title: 'Meatballs' },
  { _id: '1007', type: 'movie', title: 'Stripes' },
  { _id: '1008', type: 'movie', title: 'What about Bob?' },
  { _id: '1009', type: 'movie', title: 'Life Aquatic' },
]

//const getDocs = (prefix) => map(over(lensProp("id"), concat(prefix)));
export default function (data) {
  const setup = () => $fetch(() => data.bulk(docs))

  const listDocuments = (flags = {}) => $fetch(() => data.list(flags))

  const tearDown = () =>
    Async.of(docs)
      .map(map(assoc('_deleted', true)))
      .chain((docs) => $fetch(() => data.bulk(docs)))

  test('GET /data/test - get docs with no flags', () =>
    tearDown()
      .chain(setup)
      .chain(listDocuments)
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 9), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?keys=[\'1002\', \'1005\', \'1008\']', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ keys: ['1002', '1005', '1008'] }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 3), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?startkey=1004', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ startkey: '1004' }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 6), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?endkey=1008', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ endkey: '1008' }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 8), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?startkey=1004&endkey=1008', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ startkey: '1004', endkey: '1008' }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 5), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?limt=2', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ limit: 2 }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (assertEquals(r.docs.length, 2), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .chain(tearDown)
      .toPromise())

  test('GET /data/test?descending=true', () =>
    tearDown()
      .chain(setup)
      .chain(() => listDocuments({ descending: true }))
      .map((r) => (assertEquals(r.ok, true), r))
      .map((r) => (r.docs.forEach((doc) => assert(doc._id)), r))
      .map((r) => (assertEquals(r.docs[r.docs.length - 1]._id, '1001'), r))
      .chain(tearDown)
      .toPromise())
}
