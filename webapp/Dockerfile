FROM node:19

RUN apt-get update -y
RUN apt install -y chromium

COPY . /app

WORKDIR /app

RUN yarn install

RUN yarn run build

CMD node webapp.server.js