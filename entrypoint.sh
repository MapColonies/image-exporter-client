node ./confd/generate-config.js --environment production
cp public/env-config.js env-config.js
nginx -g "daemon off;"
