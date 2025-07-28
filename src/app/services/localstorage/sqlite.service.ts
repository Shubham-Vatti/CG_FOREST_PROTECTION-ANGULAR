// src/app/services/sqlite.service.ts
import { Injectable } from '@angular/core';
import {
  CapacitorSQLite,
  SQLiteDBConnection,
  SQLiteConnection,
  capSQLiteSet,
  capSQLiteChanges,
  CapacitorSQLitePlugin,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import {
  Get_Beat_Data_CastAndCrimTypeMasterResponse,
  GetCastAndCrimTypeMasterResponseModal,
  SuccessResponse,
} from 'src/app/profile-data/profile_data.model';

/* ------------------------------------------------------------------ */
/* Models                                                              */
/* ------------------------------------------------------------------ */
export interface EmployeeData {
  emp_id: number;
  f_name: string;
  l_name: string;
  designation_id: string;
  designation_name: string;
  circle_id: string;
  circle_name: string;
  division_id: string;
  division_name: string;
  sub_division_id: string;
  sub_division_name: string;
  range_id: string;
  range_name: string;
  sub_rang_id: string;
  sub_rang_name: string;
  beat_id: string;
  beat_name: string;
  password: string | null;
  unique_device_id: string;
}

export interface GetCastAndCrimTypeMasterResponse {
  response: SuccessResponse;
  crim_type_data: GetCastAndCrimTypeMasterResponseModal[];
  cast_data: GetCastAndCrimTypeMasterResponseModal[];
  beat_name: Get_Beat_Data_CastAndCrimTypeMasterResponse[];
}

/* ------------------------------------------------------------------ */
/* Service                                                             */
/* ------------------------------------------------------------------ */
@Injectable({ providedIn: 'root' })
export class SQLiteService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  private readonly DB_NAME = 'forestcomplainapp.db'; // Change for production
  private readonly DB_ENCRYPTION_KEY = 'forest-complain-key'; // Change for production
  private isDbInitialized = false;

  async initializeDatabase(): Promise<void> {
    if (this.isDbInitialized) return;

    try {
      // Check platform
      const platform = Capacitor.getPlatform();

      // For web, initialize the web store
      if (platform === 'web') {
        await this.sqlite.initWebStore();
      }

      // Create or open the database
      this.db = await this.sqlite.createConnection(
        this.DB_NAME,
        false, // not encrypted in this example
        this.DB_ENCRYPTION_KEY,
        1, // version
        false // readonly
      );

      // Open the database
      await this.db.open();

      // Create tables
      await this.createTables();

      this.isDbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database', error);
      throw error;
    }
  }

  private async createTables() {
    await this.db.execute(`
        CREATE TABLE IF NOT EXISTS login_user (
          id       INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT,
          token    TEXT
        );
        CREATE TABLE IF NOT EXISTS users (
  emp_id INTEGER PRIMARY KEY,
  f_name TEXT,
  l_name TEXT,
  designation_id TEXT,
  designation_name TEXT,
  circle_id TEXT,
  circle_name TEXT,
  division_id TEXT,
  division_name TEXT,
  sub_division_id TEXT,
  sub_division_name TEXT,
  range_id TEXT,
  range_name TEXT,
  sub_rang_id TEXT,
  sub_rang_name TEXT,
  beat_id INTEGER,
  beat_name TEXT,
  password TEXT,
  unique_device_id TEXT
);
CREATE TABLE IF NOT EXISTS cast_category (
  id INTEGER PRIMARY KEY,
  name TEXT
);
CREATE TABLE IF NOT EXISTS beat (
  id INTEGER PRIMARY KEY,
  name TEXT
);
CREATE TABLE IF NOT EXISTS beat_compartment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  beat_id INTEGER,
  compartment_no TEXT,
  FOREIGN KEY (beat_id) REFERENCES beat(id)
);
CREATE TABLE IF NOT EXISTS crim_type (
  id INTEGER PRIMARY KEY,
  name TEXT
);
CREATE TABLE IF NOT EXISTS crim_dhara (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crim_id INTEGER,
  dhara TEXT,
  FOREIGN KEY (crim_id) REFERENCES crim_type(id)
);
      `);
  }

  // Helper method to ensure database is open
  private async ensureDbIsOpen(): Promise<void> {
    if (!this.isDbInitialized) {
      await this.initializeDatabase();
    }
  }

  /* =============================================================== */
  /* Public API                                                      */
  /* =============================================================== */

  /** Insert (or overwrite) the last‑used credentials. */
  async storeLoginData(payload: any): Promise<void> {
    this.ensureDbIsOpen();
    const emp = payload.data?.[0];
    if (emp) {
      await this.db.run(
        `INSERT OR REPLACE INTO users (
        emp_id, f_name, l_name, designation_id, designation_name,
        circle_id, circle_name, division_id, division_name,
        sub_division_id, sub_division_name, range_id, range_name,
        sub_rang_id, sub_rang_name, beat_id, beat_name, password, unique_device_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [
          emp.emp_id,
          emp.f_name,
          emp.l_name,
          emp.designation_id,
          emp.designation_name,
          emp.circle_id,
          emp.circle_name,
          emp.division_id,
          emp.division_name,
          emp.sub_division_id,
          emp.sub_division_name,
          emp.range_id,
          emp.range_name,
          emp.sub_rang_id,
          emp.sub_rang_name,
          emp.beat_id,
          emp.beat_name,
          emp.password,
          emp.unique_device_id,
        ]
      );
    }

    for (const cast of payload.cast || []) {
      await this.db.run(
        `INSERT OR REPLACE INTO cast_category (id, name) VALUES (?, ?)`,
        [cast.id, cast.name]
      );
    }

    for (const beat of payload.beat || []) {
      await this.db.run(
        `INSERT OR REPLACE INTO beat (id, name) VALUES (?, ?)`,
        [beat.id, beat.name]
      );

      for (const comp of beat.compartment_no || []) {
        await this.db.run(
          `INSERT INTO beat_compartment (beat_id, compartment_no) VALUES (?, ?)`,
          [beat.id, comp]
        );
      }
    }

    for (const crime of payload.crimType || []) {
      await this.db.run(
        `INSERT OR REPLACE INTO crim_type (id, name) VALUES (?, ?)`,
        [crime.id, crime.name]
      );

      for (const dhara of crime.dhara || []) {
        await this.db.run(
          `INSERT INTO crim_dhara (crim_id, dhara) VALUES (?, ?)`,
          [crime.id, dhara]
        );
      }
    }
  }

  // /** Get the most‑recent credentials or `null` if none. */
  async getLoginData(): Promise<{ username: string; token: string } | any> {
    const result = await this.db.query('SELECT * FROM cast_category');
    return result.values;
  }

  async getOfflineData(): Promise<any> {
    const result: any = {};

    // 1. Get employee
    const empRes = await this.db.query('SELECT * FROM users');
    result.data = empRes.values;

    // 2. Get cast categories
    const castRes = await this.db.query('SELECT * FROM cast_category');
    result.cast = castRes.values;

    // 3. Get beat and compartments
    const beatRes = await this.db.query('SELECT * FROM beat');
    const beats = [];

    if (beatRes.values && beatRes.values.length > 0) {
      for (const beat of beatRes.values) {
        const compRes = await this.db.query(
          'SELECT compartment_no FROM beat_compartment WHERE beat_id = ?',
          [beat.id]
        );
        beats.push({
          id: beat.id,
          name: beat.name,
          compartment_no: (compRes.values || []).map(
            (c: any) => c.compartment_no
          ),
        });
      }
    }
    result.beat = beats;

    // 4. Get crime type and dhara
    const crimeRes = await this.db.query('SELECT * FROM crim_type');
    const crimTypes = [];

    if (crimeRes.values && crimeRes.values.length > 0) {
      for (const crime of crimeRes.values) {
        const dharaRes = await this.db.query(
          'SELECT dhara FROM crim_dhara WHERE crim_id = ?',
          [crime.id]
        );
        crimTypes.push({
          id: crime.id,
          name: crime.name,
          dhara: (dharaRes.values || []).map((d: any) => d.dhara),
        });
      }
    }

    result.crimType = crimTypes;

    return result;
  }

  // /** Wipe the login table. */
  // async clearLoginData(): Promise<void> {
  //   const db = await this.ensureDB();
  //   await db.execute('DELETE FROM login_user;');
  // }

  // /** Call once, e.g. in `AppComponent.ngOnInit`, to shut down cleanly. */
  // async closeConnection(): Promise<void> {
  //   if (this.db) {
  //     await this.sqliteConnection.closeConnection(
  //       'forestcomplainapp',
  //       this.platform !== 'web'
  //     );
  //     this.db = null;
  //   }
  // }

  // /* =============================================================== */
  // /* Private helpers                                                 */
  // /* =============================================================== */

  // /** Return a ready‑to‑use connection, opening/creating if required. */
  // private async ensureDB(): Promise<SQLiteDBConnection> {
  //   if (this.db && (await this.db.isDBOpen())) return this.db;
  //   const db = await this.initDB();
  //   if (!db) throw new Error('SQLite database could not be opened.');
  //   return db;
  // }

  // /** Idempotent initialiser (safe to call many times). */
  // public async initDB(): Promise<SQLiteDBConnection | null> {
  //   try {
  //     const isConnExists = await this.sqliteConnection.isConnection(
  //       'forestcomplainapp',
  //       false
  //     );
  //     console.log('-connnection-data-', isConnExists);
  //     this.db = await this.sqliteConnection.createConnection(
  //       'forestcomplainapp',
  //       false,
  //       'no-encryption',
  //       1,
  //       this.platform !== 'web'
  //     );
  //     await this.db.open();

  //     /* ----------------------------------------------------------- */
  //     /* Schema                                                      */
  //     /* ----------------------------------------------------------- */
  //     await this.db.execute(`
  //       CREATE TABLE IF NOT EXISTS login_user (
  //         id       INTEGER PRIMARY KEY AUTOINCREMENT,
  //         username TEXT,
  //         token    TEXT
  //       );
  //     `);

  //     await this.db.execute(`
  //       CREATE TABLE IF NOT EXISTS employee_data (
  //         emp_id            INTEGER PRIMARY KEY,
  //         f_name            TEXT,
  //         l_name            TEXT,
  //         designation_id    TEXT,
  //         designation_name  TEXT,
  //         circle_id         TEXT,
  //         circle_name       TEXT,
  //         division_id       TEXT,
  //         division_name     TEXT,
  //         sub_division_id   TEXT,
  //         sub_division_name TEXT,
  //         range_id          TEXT,
  //         range_name        TEXT,
  //         sub_rang_id       TEXT,
  //         sub_rang_name     TEXT,
  //         beat_id           TEXT,
  //         beat_name         TEXT,
  //         password          TEXT,
  //         unique_device_id  TEXT
  //       );
  //     `);

  //     return this.db;
  //   } catch (error) {
  //     console.error('[SQLite] initDB() failed -catch--:', error);
  //     this.db = null;
  //     return null;
  //   }
  // }
}
