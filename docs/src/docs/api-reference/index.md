# API Reference

The hyper Service Framework is built using the
[Ports and Adapters](/docs/concepts/ports-and-adapters) architecture, and so can be presented using
any [hyper Driving Adapter aka. "App"](/docs/build/custom-app) implementation.

For example, a hyper App may choose to expose an HTTP-based RESTful API, for consuming the hyper
Server over HTTP using REST semantics, while another hyper App may choose to expose an HTTP-based
GraphQL API. The hyper Service Framework itself is presentation agnostic -- it's whatever the hyper
`App` implementation chooses to expose!

You can choose to use a pre-built hyper Driving adapter, or you could implement (Read more
[here](/docs/build/custom-app))

The hyper Core team has already built some hyper Driving Adapters:

- [HTTP-based and RESTful](/docs/api-reference/rest/index)
- More to come!
