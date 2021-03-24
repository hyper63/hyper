const q = require('./queue'

module.exports = ({queue, events}) => 
({
  create: (input) => q.create(input).runWith({svc: queue, events}),
  'delete': (name) => q.delete(name).runWith({svc: queue, events}),
  post: (input) => q.post(input).runWith({svc: queue, events}),
  list: (input) => q.list(input).runWith({svc: queue, events}),
  cancel: (input) => q.cancel(input).runWith({svc: queue, events})
})
