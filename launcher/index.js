const sh = require("shelljs");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

module.exports = () => {
  if (!sh.which("docker-compose")) {
    sh.echo(
      "Sorry, this script requires docker-compose which can be installed from docker desktop"
    );
    sh.exit(1);
  }
  if (!sh.test("-e", "~/.hyper63")) {
    sh.mkdir("~/.hyper63");
  }

  const config = `version: "3.8"
services:
  web:
    image: "hyper63/hyper63:unstable"
    environment:
      REDIS: redis://redis:6379
      COUCHDB: http://admin:password@couchdb:5984
      MINIO: http://admin:password@minio:9000
      ES: http://elasticsearch:9200
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
    command: server /data
  elasticsearch:
    image: elasticsearch:7.9.3 
    volumes:
    - "./data:/usr/share/elasticsearch/data"
    environment:
      discovery.type: single-node
`;

  fs.writeFileSync(`${process.env.HOME}/.hyper63/docker-compose.yml`, config);

  sh.cd("~/.hyper63");
  sh.exec("docker-compose up -d");

  setTimeout(() => {
    sh.exec(
      `docker exec hyper63_couchdb_1 curl -X POST -H "Content-Type: application/json" localhost:5984/_cluster_setup -d '{"action":"enable_single_node", "bind_address":"0.0.0.0"}' -u 'admin:password' `,
      { silent: true },
      (code, stdout, stderr) => {
        if (code === 0) {
          console.log("Successfully setup database");
        } else {
          console.log("ERROR! Could not setup database, try to re-run script");
        }
      }
    );
  }, 5000);
};
