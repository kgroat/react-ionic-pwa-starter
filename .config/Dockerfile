FROM node:8-alpine
LABEL maintainer="Kevin Groat <apps@kevingroat.io>"

ENV NPM_CONFIG_LOGLEVEL error

RUN mkdir -p /usr/src/app

RUN adduser -S nodejs
RUN chown nodejs: /usr/src/app
USER nodejs

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY public public
COPY server server
COPY .config/server.config.js .

ENV NODE_ENV production
RUN npm i --production

ENV HOST "0.0.0.0"
ENV PORT 3000
EXPOSE 3000

RUN ls -al -R

CMD npx pm2-runtime start server.config.js