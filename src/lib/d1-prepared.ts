/// <reference path="../../worker-configuration.d.ts" />

const preparedStatementCache = new WeakMap<D1Database, Map<string, D1PreparedStatement>>();
const preparedQueryCache = new WeakMap<object, Map<string, unknown>>();

export type D1BatchResponse<T = unknown> = D1Result<T>[];

export function cachedD1Statement(db: D1Database, query: string) {
  let statements = preparedStatementCache.get(db);
  if (!statements) {
    statements = new Map();
    preparedStatementCache.set(db, statements);
  }

  let statement = statements.get(query);
  if (!statement) {
    statement = db.prepare(query);
    statements.set(query, statement);
  }
  return statement;
}

export async function runD1Batch<T = unknown>(db: D1Database, statements: D1PreparedStatement[]): Promise<D1BatchResponse<T>> {
  // D1 batches are implicit SQL transactions: statements execute in order, and a failure rolls back the batch.
  return db.batch<T>(statements);
}

export function cachedPreparedQuery<TPrepared>(db: object, key: string, build: () => TPrepared): TPrepared {
  let queries = preparedQueryCache.get(db);
  if (!queries) {
    queries = new Map();
    preparedQueryCache.set(db, queries);
  }

  const existing = queries.get(key);
  if (existing) return existing as TPrepared;

  const prepared = build();
  queries.set(key, prepared);
  return prepared;
}
