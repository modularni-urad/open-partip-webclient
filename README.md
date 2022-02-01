# OpenPartip webclient

# NOTE: tohle uz ma cenu mozna jen kvuli [auth](src/components/pages/auth)

## how to build

```
npm run build
```

Or with docker:

```
docker pull node:lts-alpine3.9
docker run -w="/tmp" -v $PWD:/tmp --rm=true node:lts-alpine3.9 \
  /bin/sh -c "npm i --only=production --verbose && npm run build"
```

## how to debug

``` bash
# Install dependencies.
npm install

# Serve with automatic reloading.
npm start
```

## License

MIT
