from node:16-alpine

RUN apk add --update openssl && rm -rf /var/cache/apk/*

COPY node_modules /node_modules
COPY certs /certs
COPY *.js /