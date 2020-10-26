const sh = require('shelljs')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

module.exports = () => {

if (!sh.which('docker-compose')) {
  sh.echo('Sorry, this script requires docker-compose which can be installed from docker desktop')
  sh.exit(1)
}

sh.mkdir('~/.hyper63')

const config = `version: "3.8"
services:
  web:
    image: "hyper63/atlas:unstable"
    environment:
      REDIS: redis://redis:6379
      COUCH: http://admin:password@couchdb:5984
      MINIO: http://admin:password@minio:9000
    ports:
      - "6363:6363"
    depends_on:
      - redis
  redis:
    image: "redis:alpine"
    volumes:
      - ".:/data"
  couchdb:
    image: "couchdb"
    environment:
      COUCHDB_USER: "admin"
      COUCHDB_PASSWORD: "password"
    volumes:
      - ".:/opt/couchdb/data"
  minio:
      image: minio/minio
      environment:
        MINIO_ACCESS_KEY: admin
        MINIO_SECRET_KEY: password
      volumes:
        - "./data:/data"
      ports:
        - "9000:9000"
      command: server /data
`

fs.writeFileSync(`${process.env.HOME}/.hyper63/docker-compose.yml`, config)

sh.cd('~/.hyper63')
sh.exec('docker-compose up -d')

setTimeout(() => {

sh.exec(`docker exec hyper63_couchdb_1 curl -X POST -H "Content-Type: application/json" localhost:5984/_cluster_setup -d '{"action":"enable_single_node", "bind_address":"0.0.0.0"}' -u 'admin:password' `)

}, 2000)

}
