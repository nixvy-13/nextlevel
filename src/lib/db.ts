import type { Env } from './types';

export class Database {
  constructor(private db: D1Database) {}

  async query<T>(sql: string, bindings?: any[]): Promise<T[]> {
    try {
      const stmt = this.db.prepare(sql);
      const boundStmt = bindings ? stmt.bind(...bindings) : stmt;
      const result = await boundStmt.all();
      return result.results as T[];
    } catch (error) {
      console.error(`Query error: ${sql}`, error);
      throw error;
    }
  }

  async queryOne<T>(sql: string, bindings?: any[]): Promise<T | null> {
    try {
      const stmt = this.db.prepare(sql);
      const boundStmt = bindings ? stmt.bind(...bindings) : stmt;
      const result = await boundStmt.first();
      return result as T | null;
    } catch (error) {
      console.error(`QueryOne error: ${sql}`, error);
      throw error;
    }
  }

  async execute(sql: string, bindings?: any[]): Promise<boolean> {
    try {
      const stmt = this.db.prepare(sql);
      const boundStmt = bindings ? stmt.bind(...bindings) : stmt;
      const result = await boundStmt.run();
      return result.success;
    } catch (error) {
      console.error(`Execute error: ${sql}`, error);
      throw error;
    }
  }

  async batch<T>(
    statements: Array<{ sql: string; bindings?: any[] }>
  ): Promise<T[]> {
    try {
      const prepared = statements.map((stmt) => {
        const prepared = this.db.prepare(stmt.sql);
        return stmt.bindings ? prepared.bind(...stmt.bindings) : prepared;
      });
      const result = await this.db.batch(prepared);
      return result as T[];
    } catch (error) {
      console.error("Batch error", error);
      throw error;
    }
  }
}

export function getDatabase(env: Env): Database {
  return new Database(env.DB);
}
