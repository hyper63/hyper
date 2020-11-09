# hyper63 Ports

A port is a specification for adapters, this specification gives the core engine some guarantees on how an adapter will be implemented so that the implementation details of the given adapter can be altered without effecting the core business logic.

For example, if you are using the data port which the business logic expects to be able to save and retrieve documents, you can create and specify adapters to different data stores as long as the adapters are implemented in a way that supports the data port.

Currently, there are five ports in development:

- cache
- data
- storage
- search
- hooks

Each port will specify how the adapter is supposed to be implemented.
