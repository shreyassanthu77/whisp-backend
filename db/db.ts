import { DB, QueryParameter } from "https://deno.land/x/sqlite@v3.7.2/mod.ts";

const db = new DB("database.sqlite3");

export function query<T extends Record<string, unknown>>(
  q: TemplateStringsArray,
  ...args: QueryParameter[]
) {
  let sql = q[0];
  for (let i = 0; i < args.length; i++) {
    sql += "?" + q[i + 1];
  }
  return db.queryEntries<T>(sql, args);
}

export function queryOne<T extends Record<string, unknown>>(
  q: TemplateStringsArray,
  ...args: QueryParameter[]
) {
  let sql = q[0];
  for (let i = 0; i < args.length; i++) {
    sql += "?" + q[i + 1];
  }
  return db.queryEntries<T>(sql, args)[0] ?? null;
}

export function sql(q: TemplateStringsArray, ...args: QueryParameter[]) {
  let sql = q[0];
  for (let i = 0; i < args.length; i++) {
    sql += args[i] + q[i + 1];
  }
  return db.execute(sql);
}

export function prepare<
  T extends Record<string, unknown>,
  Args extends string[] = string[]
>(q: TemplateStringsArray, ...args: Args) {
  let sql = q[0];
  for (let i = 0; i < args.length; i++) {
    sql += `:${args[i]}` + q[i + 1];
  }
  const query = db.prepareQuery<
    (keyof T)[],
    T,
    Record<Args[number], QueryParameter>
  >(sql);
  return query;
}
