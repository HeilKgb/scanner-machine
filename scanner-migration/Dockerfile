FROM node:14.7.0-alpine3.12
WORKDIR /var/scanner
COPY ./package*.json ./
RUN apk --no-cache --virtual build-dependencies \
  add --update py-pip make g++ && \
  npm install --production && \
  apk del build-dependencies
COPY . .
ENTRYPOINT [ "npm", "start" ]