# An expermental project investigation the programming language Gren

Gren is like elm, but it runs in nodes, doesnt have tuples, and has more bugs


## This is a simple webserver
Just run:
```sh
docker-compose up --build
```

### Todos
- [ ] Create a diagram of the model
- [ ] restructure Lib - The owndership of the model, ctx, and, Strain doesnt belong in the same
  folder or concept (Why does our lib expose what a strain is, we shouldnt care to tell you)
- [ ] convert port.js to a typescript project that builds to a single file (the pretty builder?
  doesnt seem to support multiple files)
- [ ] implement ui for displaying strains
- [ ] implement another project for scraping from pupppeteer (stealth plugin too)
