FROM node:13-alpine

WORKDIR /var/auxility/url-shortener

COPY . ./

RUN npm install

ENTRYPOINT node src/index.js
