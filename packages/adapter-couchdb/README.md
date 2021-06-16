# hyper63 couchdb-adapter

This adapter connects the hyper63 service framework `data` port to the couchdb
database. When using this adapter, you will need to configure three environment
variables, one for the `server-admin` credentials, so that the adapter can
create/delete databases, and one for the `db-admin` user so a search index can
be created. And finally one for the `db-user` user to manage documents.

.env

```
DATA_SVR_ADMIN=XXX_URL
DATA_DB_ADMIN=XXX_URL
DATA_DB_USER=XXX_URL
```

The value of the connection url should be in the following format:

> `[protocol]://[key]:[secret]@[host]:[port]`

When a new database is created, the following roles will be added to the
security document:

- db-admin
- db-user

Using this adapter, you will not have any access to the \_users table or the
_replicator table

## Setup a standalone couchdb server using docker

Dockerfile

```
FROM couchdb:3.1.1

RUN echo '[couchdb]' > /opt/couchdb/etc/local.d/10-single-node.ini
RUN echo 'single_node=true' >> /opt/couchdb/etc/local.d/10-single-node.ini
```

```sh
docker build -t single-couchdb:1 .
docker run -d -p 5984:5984 -e COUCHDB_USER=admin -e COUCHDB_PASSWORD=password --name couch single-couchdb:1
```
