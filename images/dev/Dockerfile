FROM node:14

WORKDIR /usr/src/hyper63

COPY hyper63.config.js ./
COPY index.js ./
COPY package.json ./
COPY yarn.lock ./
RUN yarn
RUN mkdir /data

VOLUME /data

EXPOSE 6363

CMD ["yarn", "start"]

