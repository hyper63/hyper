// TODO: get redis module
const Async = require("crocks/Async");

const noop = () => Async.Resolved({ ok: true });

// atlas cache implementation interface
module.exports = (env) => ({
  createStore: noop,
  destroyStore: noop,
  createDoc: noop,
  getDoc: noop,
  updateDoc: noop,
  deleteDoc: noop,
});
