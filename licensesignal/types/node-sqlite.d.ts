// Ambient declaration for Node's built-in node:sqlite (Node >= 22.5). The pinned
// @types/node predates it, so we declare a minimal surface. Typed loosely on
// purpose — callers in lib/prospects-db.ts already treat it as `any`.
declare module 'node:sqlite' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class DatabaseSync {
    constructor(path: string, options?: { readOnly?: boolean })
    exec(sql: string): void
    prepare(sql: string): {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      run(...params: any[]): { lastInsertRowid: number | bigint; changes: number }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get(...params: any[]): any
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      all(...params: any[]): any[]
    }
    close(): void
  }
}
