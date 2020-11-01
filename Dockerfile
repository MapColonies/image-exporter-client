FROM node:12.18.3-alpine3.12 AS build

WORKDIR /opt/myapp

COPY package*.json ./

RUN yarn install --production

COPY . .

RUN yarn run confd:prod

RUN yarn build

FROM nginx:1.19.1-alpine

# Install Node for running confd
RUN set -eux & apk add --no-cache nodejs

COPY entrypoint.sh /entrypoint.sh

WORKDIR /usr/share/nginx/html

COPY --from=build /opt/myapp/build ./

# Move env-config.js to location in which confd script expects it to be located
RUN mkdir public && cp env-config.js public/env-config.js

CMD ["/entrypoint.sh"]
