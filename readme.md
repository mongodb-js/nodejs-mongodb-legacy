# MongoDB Node.js Driver with Optional Callback Support Legacy Package

**Attention :memo:**

This is a wrapper of the `mongodb` driver, if you are starting a new project you likely just want to use the driver directly:

- [Driver Source](https://github.com/mongodb/node-mongodb-native/)
- [Driver NPM Package](https://www.npmjs.com/package/mongodb)

**Upgrading to version 5? Take a look at our [upgrade guide here](https://github.com/mongodb/node-mongodb-native/blob/HEAD/etc/notes/CHANGES_5.0.0.md)!**

## Purpose

This package is intended to assist in migrating to promise based APIs.
We have wrapped every driver method to continue offering the optional callback support some projects may be relying on to incrementally migrate to promises.
Any new APIs added to the driver will not offer optional callback support.
If callback usage is needed for any new APIs, we would suggest using `.then`/`.catch` or node's [callbackify](https://nodejs.org/dist/latest-v16.x/docs/api/util.html#utilcallbackifyoriginal) to get that desired API.

The main driver package `mongodb` will be dropping optional callback support in the next major version (v5) in favor of `async`/`await` syntax.

### Drawbacks

- The legacy driver wraps the native driver, which may lead to a slight performance penalty.
- As discussed in the versioning section below, it is recommended that `mongodb-legacy` replace the direct dependency on `mongodb`.  This allows for
the legacy driver to automatically pull in features and fixes from the native driver.  However, this also removes control
of which version of `mongodb` is installed.  If users wish to control the version of `mongodb` directly, the lockfile will need to be edited manually.

### Example usage of equivalent callback and promise usage

```ts
// Just add '-legacy' to my mongodb import
import { MongoClient } from 'mongodb-legacy';
const client = new MongoClient();
const db = client.db();
const collection = db.collection('pets');

// Legacy projects may have intermixed API usage:
app.get('/endpoint_promises', (req, res) => {
  collection
    .findOne({})
    .then(result => {
      res.end(JSON.stringify(result));
    })
    .catch(error => {
      res.errorHandling(error);
    });
});

app.get('/endpoint_callbacks', (req, res) => {
  collection.findOne({}, (error, result) => {
    if (error) return res.errorHandling(error);
    res.end(JSON.stringify(result));
  });
});
```

## How to install

In your existing project add `mongodb-legacy` to your `package.json` with the following command.

```sh
npm install mongodb-legacy
```

### Versioning

We recommend replacing your `mongodb` dependency with this one.
This package uses caret semver range for the main `mongodb` package, (ex. `^4.10.0`) which will adopt minor version bumps as they are released.

The next major release of the driver (v5) will drop support for callbacks.
This package will also have a major release at that time to update the dependency requirement to `^5.0.0`.
Users can expect to be able to upgrade to `v5` adopting the changes and features shipped in that version while using this module to maintain any callback code they still need to work on migrating.

## [API](https://mongodb.github.io/node-mongodb-native/)

The API is inherited from the driver, which is [documented here](https://mongodb.github.io/node-mongodb-native/).
If it is relevant to inspect the precise differences, you can peruse the [type definitions of wrapped APIs](https://github.com/mongodb-js/nodejs-mongodb-legacy/blob/main/mongodb-legacy.d.ts).

The wrappers are implemented as subclasses of each of the existing driver's classes with extra logic to handle the optional callback behavior. And all other driver exports are re-exported directly from the wrapper. This means any new APIs added to the driver will be automatically pulled in as long as the updated driver is installed.

Take this hypothetical example:

```ts
// Just add '-legacy' to my mongodb import
import { MongoClient } from 'mongodb-legacy';
const client = new MongoClient();
const db = client.db();

const collection = db.collection('pets');
// Returns an instance of LegacyFindCursor which is a subclass of FindCursor
const dogCursor = collection.find({ kind: 'dog' });
// Using .next with callbacks still works!
dogCursor.next((error, dog) => {
  if (error) return handling(error);
  console.log(dog);
});
// Brand new hypothetical api that pets all dogs! (does not support callbacks)
dogCursor.petAll().then(result => {
  console.log('all dogs got pats!');
});
```

> NOTE: The `petAll()` api is brand new in this hypothetical example and so would not support an optional callback. If adopting this API is deep inside code that already relies on eventually calling a callback to indicate the end of an operation it is possible to use `.then`/`.catch` chains to handle the cases that are needed. We recommend offloading this complexity to node's [callbackify utility](https://nodejs.org/dist/latest-v16.x/docs/api/util.html#utilcallbackifyoriginal): `callbackify(() => dogCursor.petAll())(callback)`

The new example `petAll()` API will be pulled in since we're building off the existing driver API.
The typescript definitions work the same way so `next()` still reports its promise and callback variants and the `petAll()` API is pulled in from the driver's definitions.

## Bugs or Features

You can reach out on our JIRA: https://jira.mongodb.org/projects/NODE and let us know any issues your run into while using this package.

## License

[Apache 2.0](https://github.com/mongodb-js/nodejs-mongodb-legacy/blob/main/LICENSE)

:copyright: 2022-present MongoDB
