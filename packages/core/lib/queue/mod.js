import * as q from './queue.js';

export default function ({ queue, events }) {
  return ({
    index: () => q.index().runWith({ svc: queue, events }),
    create: (input) => q.create(input).runWith({ svc: queue, events }),
    delete: (name) => q.del(name).runWith({ svc: queue, events }),
    post: (input) => q.post(input).runWith({ svc: queue, events }),
    list: (input) => q.list(input).runWith({ svc: queue, events }),
    cancel: (input) => q.cancel(input).runWith({ svc: queue, events }),
  });
}
