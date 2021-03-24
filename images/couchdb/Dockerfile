FROM node:14

# Install Project
WORKDIR /usr/src/hyper63

COPY hyper63.config.js ./
COPY index.js ./
COPY package.json ./
COPY middleware/jwt.js ./middleware/
COPY README.md ./

RUN yarn

EXPOSE 6363

CMD ["yarn", "start"]
