# MongoDB Node.js Driver with Optional Callback Support Legacy Package

**Attention 📝**

This is a wrapper of the `mongodb` driver, if you are starting a new project you likely just want to use the driver directly:

- [Driver Source](https://github.com/mongodb/node-mongodb-native/)
- [Driver NPM Package](https://www.npmjs.com/package/mongodb)

## Purpose

This package is intended to assist in migrating to promise based APIs.
We have wrapped every driver method to continue offering the optional callback support some projects may be relying on to incrementally migrate to promises.
The main driver package `mongodb` will be dropping support in the next major version (v5) for the optional callback behavior in favor of adopting `async`/`await` syntax for native promise support.

```ts
// Just add '-legacy' to my mongodb import
import { MongoClient } from 'mongodb-legacy';
const client = new MongoClient();
const db = client.db();
const collection = db.collection('pets');

// Legacy projects may have intermixed API usage:
app.get('/endpoint_promises', (req, res) => {
  collection.findOne({}).then(result => {
    res.end(JSON.stringify(result));
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

There is no one size fits all solution to how your project and policies may require pulling in dependencies, below is one recommended path.

**We recommend you keep `mongodb` in your project's direct dependencies**.
The package has a direct dependency on the `mongodb` package of `^4.10.0`.
So when you're ready to upgrade to `v4.10+` and want to start working with this wrapper package keeping `mongodb` in your project's dependencies will allow you to control upgrades explicitly as needed.
Without `mongodb` specified in your project's dependencies it will be up to `npm` and your `package-lock.json` file updating policy to control when new driver versions are pulled into your project.

The next major release of the driver (v5) will drop support for callbacks.
This package will also have a major release at that time to update the peerDependency requirement to `v5+`.
Users can expect to be able to upgrade to `v5` adopting the changes and features shipped in that version while using this module to maintain any callback code they still need to work on migrating.

## API

The API is inherited from the driver so you should be able to peruse the API docs

- [Found here](https://mongodb.github.io/node-mongodb-native/Next/)

The wrappers are implemented as subclasses of each of our driver's classes that you may use building your app that just handles the optional callback behavior. This means any new APIs added to the driver should be automatically be pulled in as long as the updated driver is installed.

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
// Brand new api that pets all dogs!
dogCursor.petAll().then(result => {
  console.log('all dogs got pats!');
});
```

The `petAll()` API will be pulled in since we're building off the existing driver API.
The typescript definitions work the same way so `next()` still reports it's promise and callback variants and the `petAll()` API is pulled in from the driver's definitions.

## Bugs or Features

You can reach out on our JIRA: https://jira.mongodb.org/projects/NODE and let us know any issues your run into while using this package.
