---
title: 'Getting Started with Atlas Toolkit'
excerpt: ''
coverImage: '/assets/blog/preview/cover.jpg'
date: '2020-03-16T05:35:07.322Z'
author: Tom Wilson
---

<article>
  <aside>
    
    NOTE: Before you get started with Atlas, you may want some background information on what Atlas Toolkit is and Why Atlas Toolkit. [Why Atlas?](/why)
  
  </aside>
</article>

## Installing Atlas Toolkit locally

Atlas Toolkit is built using docker and each of its default services are provided using docker images, this gives developers a cloud-native development experience.

Prerequisites

- Docker Desktop - https://docker.com

The first thing you need to do is create a docker compose file

docker-compose.yml

```yaml
version: "3.8"
services:
  web:
    image: "hyper63/atlas:unstable"
    environment:
      REDIS: redis://redis:6379
      COUCH: http://admin:password@couchdb:5984
      MINIO: http://minio:minio123@minio:9000
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
        MINIO_ACCESS_KEY: minio
        MINIO_SECRET_KEY: minio123
      volumes:
        - "./data:/data"
      ports:
        - "9000:9000"
      command: server /data
```

Couple of notes about this docker-compose file, it is creating four docker containers, atlas, redis, couch, and minio. It is setting the docker volumes to store all persistent data in the current directory that you have placed the docker-compose file. You can change this by modifying the left side of the colon under each volumes entry. For minio and couchdb you will need a key and secret or user and password. It is important that these are configured the same for both the minio/couch containers and the atlas container in the environment section.

To launch your atlas environment, you will need to do two steps. The first step is to spin up the docker-compose resources, the second step is to initialize the couchdb service.

```sh
docker-compose up -d
```

```sh
docker exec -it atlas_couchdb_1 \ .
curl -X POST -H "Content-Type: application/json" \ .
localhost:5984/_cluster_setup \ .
-d '{"action":"enable_single_node", "bind_address":"0.0.0.0"}' \ .
-u 'admin:password'
```

<article>
  <aside>

    NOTE: Keep in mind the `-u 'admin:password'` should reflect the same settings as your docker compose file

  </aside>
</article>
