# hyper63 couchdb-adapter

This adapter connects the hyper63 service framework `data` port to the couchdb database. When using this adapter, you will need to configure three environment variables, one for the `server-admin` credentials, so that the adapter can create/delete databases, and one for the `db-admin` user so a search index can be created. And finally one for the `db-user` user to manage documents.

.env

```
DATA_SVR_ADMIN=XXX_URL
DATA_DB_ADMIN=XXX_URL
DATA_DB_USER=XXX_URL
```

The value of the connection url should be in the following format:

[protocol]://[key]:[secret]@[host]:[port]

When a new database is created, the following roles will be added to the security document:

- db-admin
- db-user

Using this adapter, you will not have any access to the \_users table or the \_replicator table

## Setup a standalone couchdb server using docker

```sh
# get latest couchdb
docker pull couchdb
# create hash for admin pwd
npx couch-hash-pwd -p [admin password]
# copy password hash
docker run -d --name couchdb \
--log-opt max-size=100m \
--restart always \
-p 5984:5984 \
-v ~/common/data:/opt/couchdb/data \
-e COUCHDB_USER='admin' \
-e COUCHDB_PASSWORD='paste pwd hash' \
couchdb
# setup for single node
curl -X POST -H "Content-Type: application/json" localhost:5984/_cluster_setup -d '{"action":"enable_single_node", "bind_address":"0.0.0.0"}' -u 'admin:password'
# create db-admin user
curl -X POST -H "Content-Type: application/json" \
-d '{ "_id": "org.couchdb.user:db-admin", "name": "db-admin", "roles": ["db-admins"], "password": "pwd", "type": "user" }'  \
-u admin:admin-pwd \
localhost:5984/_users
# create db-user user
curl -X POST -H "Content-Type: application/json" \
-d '{ "_id": "org.couchdb.user:db-user", "name": "db-user", "roles": ["db-users"], "password": "pwd", "type": "user" }'  \
-u admin:admin-pwd \
localhost:5984/_users
```
