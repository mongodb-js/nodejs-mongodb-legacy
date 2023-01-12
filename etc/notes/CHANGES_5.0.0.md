# Changes in v5

## TOC

- TODO

## About

The following is a detailed collection of the changes in the major v5 release of the mongodb package for Node.js.

<!--
1. a brief statement of what is breaking (brief as in "x will now return y instead of z", or "x is no longer supported, use y instead", etc
2. a brief statement of why we are breaking it (bug, not useful, inconsistent behavior, better alternative, etc)
3. if applicable, an example of suggested syntax change (can be included in (1) )
-->

## Changes

### `Collection.mapReduce()` helper removed

The `mapReduce` helper has been removed from the `Collection` class.  The `mapReduce` operation has been
deprecated in favor of the aggregation pipeline since MongoDB server version 5.0.  It is recommended
to migrate code that uses `Collection.mapReduce` to use the aggregation pipeline (see [Map-Reduce to Aggregation Pipeline](https://www.mongodb.com/docs/manual/reference/map-reduce-to-aggregation-pipeline/)).

If the `mapReduce` command must be used, the `Db.command()` helper can be used to run the raw
`mapReduce` command.

```typescript
// using the Collection.mapReduce helper in <4.x drivers
const collection = db.collection('my-collection');

await collection.mapReduce(
  function() { emit(this.user_id, 1); },
  function(k, vals) { return 1 },
  {
    out: 'inline',
    readConcern: 'majority'
  }
)

// manually running the command using `db.command()`
const command = {
  mapReduce: 'my-collection',
  map: 'function() { emit(this.user_id, 1); }',
  reduce: 'function(k,vals) { return 1; }',
  out: 'inline',
  readConcern: 'majority'
}

await db.command(command);
```

**Note** When using the `Db.command()` helper, all `mapReduce` options should be specified
on the raw command object and should not be passed through the options object.

### Removed `Collection.insert`, `Collection.update`, and `Collection.remove`

Three legacy operation helpers on the collection class have been removed:

| Removed API                                    | API to migrate to                                  |
|------------------------------------------------|----------------------------------------------------|
| `insert(document)`                             | `insertOne(document)`                              |
| `insert(arrayOfDocuments)`                     | `insertMany(arrayOfDocuments)`                     |
| `update(filter)`                               | `updateMany(filter)`                               |
| `remove(filter)`                               | `deleteMany(filter)`                               |

The `insert` method accepted an array of documents for multi-document inserts and a single document for single document inserts.  `insertOne` should now be used for single-document inserts and `insertMany` should be used for multi-document inserts.

```ts
// Single document insert:
await collection.insert({ name: 'spot' });
// Migration:
await collection.insertOne({ name: 'spot' });

// Multi-document insert:
await collection.insert([{ name: 'fido' }, { name: 'luna' }])
// Migration:
await collection.insertMany([{ name: 'fido' }, { name: 'luna' }])
```

### Removed `keepGoing` option from `BulkWriteOptions`

The `keepGoing` option was a legacy name for setting `ordered` to `false` for bulk inserts.
It was only supported by the legacy `collection.insert()` method which is now removed as noted above.