FROM node:alpine
WORKDIR /usr/src/ssr-demo
COPY . ./
RUN yarn install && yarn global add pm2 && yarn build
CMD pm2 start ecosystem.config.js --env production --no-daemon
