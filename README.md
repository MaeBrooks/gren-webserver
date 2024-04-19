# A Pretty Nice Website

Initial setup: `npm install`

Create a `.env` at the root with the values:
##### (Example given values, but feel free to change them to whatever you want)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=abc123
DB_NAME=mongo
DB_PORT=27017

NODE_DOCKER_PORT=3000
NODE_LOCAL_PORT=3000
```

Start local dev server: `npm run dev`

The dev server will restart when files change
(but you will need to refresh the browser yourself).

## Now what?

Take a look at `server/src/Main.gren` and `client/src/Counter.gren`.

See the [examples](https://github.com/blaix/prettynice/tree/main/examples)

Create an optimized production build with `npm run build`
and start the server with `npm start`.
