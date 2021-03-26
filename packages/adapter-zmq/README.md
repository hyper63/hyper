# README

hyper queue implementation using zeromq 

This queue service is a push-pull model, where a `POST` is made to push a job on the queue, and there is 
a worker listening for `jobs` to `POST` a request to the target setup when creating the queue.

> It is also important during your clients init phase to re-initialize the queues using the `PUT` /queue/{name} request, because when the service is restarted, it will loose all queue data.

## Dependencies

This Queue service does not require any dependencies and should be scalable in a stateless cloud native environment.

> Most likely will not work in a serverless environment.

## Configuration Example

``` js
import q from '@hyper63/adapter-zmq'
export default {
  adapters: [
    { port: 'queue', plugins: [q(/* port */ '7373')]}
  ]
}
```

## Run Tests

```
yarn test
```
