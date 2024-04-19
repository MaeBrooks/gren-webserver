"strict mode";
const { MongoClient, Collection, Document } = require("mongodb");

exports.init = async function(app) {
  const {
    strainsReadAll,
    strainsReadAllSuccess,
    strainsReadAllFailure,
    strainsWriteOne,
    strainsWriteOneFailure,
    strainsWriteOneSuccess,
    print,
    databaseOnConnectionFailure,
  } = app.ports;

  // For debugging puposes
  print?.subscribe(console.log);

  const connect = database("mongodb://mongo:27017", (ctx, e) => {
    console.error(`Database failure: ${e instanceof Error ? e.message : String(e)}`);
    databaseOnConnectionFailure.send({
      ctx: ctx,
      status: 500,
      reason: "database failure",
    });
  });

  strainsReadAll.subscribe(({ ctx }) => {
    connect(ctx)("info").all(
      undefined,
      (strains) => strainsReadAllSuccess.send({
        ctx,
        strains
      }),
      (status, reason) => strainsReadAllFailure.send({
        ctx,
        status,
        reason,
      }),
    );
  });

  // TODO: This should be implemented
  if (!strainsWriteOne) return;
  strainsWriteOne.subscribe(({ ctx, strain }) => {
    connect(ctx)("info").create(
      undefined,
      (id) => strainsWriteOneSuccess.send({
        ctx,
        strain: {
          id,
          ...strain
        }
      }),
      (status, reason) => strainsWriteOneFailure.send({
        ctx,
        status,
        reason,
      }),
    );
  });
}

/** @arg {string} url */
function database(url, onConnectionFailure) {
  /** @type {MongoClient} */
  const client = new MongoClient(url);

  /** @arg {Ctx | undefined} ctx */
  return function(ctx = undefined) {
    /** @arg {string} collection */
    return function(collection) {
      return {
        all: (filter, then, error) => connect((collection) => {
          collection.find(filter).toArray().then(
            then,
            (e) => error(500, String(e))
          );
        }),
        create: (document, then, error) => connect((collection) => {
          collection.insertOne(document).then(
            ({ insertedId }) => then(insertedId),
            (e) => error(500, String(e)));
        }),
        findByID: (id, then, error) => connect((collection) => {
          collection.findOne({ id }).then(
            (document) => {
              if (document == null) {
                error(404, `Unable to find strain with id: ${id}`);
                return;
              }

              then(document);
            },
            (e) => error(500, String(e)),
          );
        }),
        update: (document, then, error) => connect((collection) => {
          collection.updateOne({ id: document.id }, document).then(
            ({ modifiedCount }) => {
              if (modifiedCount != 1) {
                error(404, "Unable to find document to update");
                return;
              }

              then(document);
            },
            (e) => error(500, String(e)),
          );
        }),
      }

      /** @arg {(collection: Collection<Document>) => void} continue_ */
      function connect(continue_) {
        client.connect()
          .then(() => {
            continue_(client.db().collection(collection));
          })
          .catch((e) => onConnectionFailure(ctx, e));
      }
    }
  }
}

/**
  * @typedef {Object} Ctx
  * @property {number} id
  */
