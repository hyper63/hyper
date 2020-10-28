FROM node:12

# Install Project
WORKDIR /usr/src/hyper63

COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY src ./

EXPOSE 6363

CMD ["yarn", "start"]
