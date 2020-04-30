FROM node:alpine AS builder

WORKDIR /usr/src/srv

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build

FROM node:lts-alpine

WORKDIR /root/

ENV NODE_ENV=production
ENV PORT=80

COPY package.json .
COPY yarn.lock .

RUN yarn --production

EXPOSE 80

COPY --from=builder /usr/src/srv/dist .

CMD [ "node", "index" ]