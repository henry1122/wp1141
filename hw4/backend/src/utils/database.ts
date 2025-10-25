import { Database } from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

// Create database connection
const db = new Database(dbPath);

// Promisify database methods
export const dbRun = promisify(db.run.bind(db)) as (sql: string, params?: any[]) => Promise<any>;
export const dbGet = promisify(db.get.bind(db)) as (sql: string, params?: any[]) => Promise<any>;
export const dbAll = promisify(db.all.bind(db)) as (sql: string, params?: any[]) => Promise<any[]>;

