FROM node:12.18.3-alpine3.12 AS prepare
#download confd 
RUN apk add --no-cache wget
RUN mkdir /confd
RUN wget -O '/confd/confd' 'https://github.com/kelseyhightower/confd/releases/download/v0.15.0/confd-0.15.0-linux-amd64'
RUN chmod +x /confd/confd
#build app
WORKDIR /opt/myapp
COPY package*.json ./
RUN yarn install --production
COPY . .
RUN yarn run confd:prod
RUN yarn build


FROM nginx:1.19.1-alpine AS production
# Install Node for running confd
RUN set -eux & apk add --no-cache nodejs
#change nginx config to work without root
RUN addgroup -S app && adduser -S app -G app
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf  && \
  sed -i '/user  nginx;/d' /etc/nginx/nginx.conf && \
  sed -i 's,/var/run/nginx.pid,/tmp/nginx.pid,' /etc/nginx/nginx.conf && \ 
  sed -i "/^http {/a \    server_tokens off;\n    proxy_temp_path /tmp/proxy_temp;\n    client_body_temp_path /tmp/client_temp;\n    fastcgi_temp_path /tmp/fastcgi_temp;\n    uwsgi_temp_path /tmp/uwsgi_temp;\n    scgi_temp_path /tmp/scgi_temp;\n" /etc/nginx/nginx.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

WORKDIR /usr/share/nginx/html
RUN mkdir public && mkdir ./confd
COPY --from=prepare /confd/confd ./confd/confd
COPY --from=prepare /opt/myapp/build ./

#give app user required permissions
RUN chown -R app /etc/nginx && chmod -R g+w /etc/nginx && \
  chown -R app /usr/share/nginx && \
  chown -R app /var/cache/nginx && chmod -R g+w /var/cache/nginx
USER app:app

CMD ["/entrypoint.sh"]
