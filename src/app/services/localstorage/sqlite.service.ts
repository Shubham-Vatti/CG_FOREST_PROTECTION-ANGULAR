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
import { Preferences } from '@capacitor/preferences';
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

export interface CrimeReport {
  id?: number;
  is_accused_found: number;
  accused_name: string;
  accused_fathers_name: string;
  accused_cast?: number;
  accused_address: string;
  type_of_crime: number;
  place_of_crime: string;
  date_of_crime: string;
  details_of_seized_goods: string;
  created_by: number;
  lat?: number;
  lng?: number;
  map_address?: string;
  circle_id?: number;
  division_id?: number;
  sub_division_id?: number;
  range_id?: number;
  sub_range_id?: number;
  beat_id?: number;
  name_of_witness_one?: string;
  name_of_witness_two?: string;
  address_of_witness_one?: string;
  address_of_witness_two?: string;
  compartment_number?: string;
  crime_dhara?: string;
  por_number?: string;
  created_at?: string;
  is_synced?: number;
}

export interface SeizedGoodsDetail {
  id?: number;
  crime_report_id: number;
  jabti_saman_type: number;
  prajati_type: number;
  lambai?: string;
  golai?: string;
  ghan_meter?: string;
  nag?: string;
  dar?: string;
  total_cost?: string;
  if_other_then_detail?: string;
}

export interface CrimePhoto {
  id?: number;
  crime_report_id: number;
  photo_data: Blob;
  file_name: string;
  created_at?: string;
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
      console.log('Platform detected:', platform);
      // For web, initialize the web store
      if (platform === 'web') {
        console.log('WEB : Initializing SQLite for web platform');
        // await this.sqlite.initWebStore();
      } else {
        const isConnectionExists = this.sqlite.isConnection(
          this.DB_NAME,
          false
        );
        if ((await isConnectionExists).result) {
          console.log('Connection already exists, reusing it.');
          this.db = await this.sqlite.retrieveConnection(this.DB_NAME, false);
        } else {
          // Create or open the database
          this.db = await this.sqlite.createConnection(
            this.DB_NAME,
            false, // not encrypted in this example
            this.DB_ENCRYPTION_KEY,
            1, // version
            false // readonly
          );
        }
      }

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

  async closeConnection(): Promise<void> {
    try {
      if (this.db) {
        const isOpen = await this.db.isDBOpen();
        if (isOpen) {
          await this.db.close();
        }
      }

      // Check if connection exists before trying to close it
      const isConnExists = await this.sqlite.isConnection(this.DB_NAME, false);
      if (isConnExists.result) {
        await this.sqlite.closeConnection(this.DB_NAME, false);
      }

      this.isDbInitialized = false;
      this.db = null as any;
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Error closing connection:', error);
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

CREATE TABLE IF NOT EXISTS dhara_data (
      id TEXT PRIMARY KEY,
      dhara_head TEXT,
      dhara_year TEXT
);

CREATE TABLE IF NOT EXISTS dhara_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dhara_id TEXT,
      item TEXT,
      FOREIGN KEY (dhara_id) REFERENCES dhara_data(id)
);

CREATE TABLE IF NOT EXISTS prajati_name (
      id INTEGER PRIMARY KEY,
      name TEXT
);
   
CREATE TABLE IF NOT EXISTS App_Language (
  key TEXT PRIMARY KEY,
  value TEXT
);


CREATE TABLE IF NOT EXISTS crime_report (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  is_accused_found INTEGER,
  accused_name TEXT,
  accused_fathers_name TEXT,
  accused_cast INTEGER,
  accused_address TEXT,
  type_of_crime INTEGER,
  place_of_crime TEXT,
  date_of_crime DATE,
  details_of_seized_goods TEXT,
  created_by INTEGER,
  lat REAL,
  lng REAL,
  map_address TEXT,
  circle_id INTEGER,
  division_id INTEGER,
  sub_division_id INTEGER,
  range_id INTEGER,
  sub_range_id INTEGER,
  beat_id INTEGER,
  name_of_witness_one TEXT,
  name_of_witness_two TEXT,
  address_of_witness_one TEXT,
  address_of_witness_two TEXT,
  compartment_number TEXT,
  crime_dhara TEXT,
  por_number TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_synced INTEGER DEFAULT 0,
  FOREIGN KEY (accused_cast) REFERENCES cast_category(id),
  FOREIGN KEY (type_of_crime) REFERENCES crim_type(id)
);

CREATE TABLE IF NOT EXISTS seized_goods_detail (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crime_report_id INTEGER,
  jabti_saman_type INTEGER,
  prajati_type INTEGER,
  lambai TEXT,
  golai TEXT,
  ghan_meter TEXT,
  nag TEXT,
  dar TEXT,
  total_cost TEXT,
  if_other_then_detail TEXT,
  FOREIGN KEY (crime_report_id) REFERENCES crime_report(id) ON DELETE CASCADE,
  FOREIGN KEY (jabti_saman_type) REFERENCES prajati_name(id),
  FOREIGN KEY (prajati_type) REFERENCES prajati_name(id)
);

CREATE TABLE IF NOT EXISTS crime_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  crime_report_id INTEGER,
  photo_data BLOB,
  file_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crime_report_id) REFERENCES crime_report(id) ON DELETE CASCADE
);
      `);
  }

  // Helper method to ensure database is open
  async ensureDbIsOpen(): Promise<void> {
    try {
      console.log('--inside-ensureDbIsOpen--', this.isDbInitialized);
      // If not initialized, initialize first
      if (!this.isDbInitialized) {
        console.log('Database not initialized, initializing now...');
        await this.initializeDatabase();
        return;
      }

      // Check if database connection exists and is open
      if (!this.db) {
        console.log('Database connection does not exist, reinitializing...');
        this.isDbInitialized = false;
        await this.initializeDatabase();
        return;
      }

      // Verify database is actually open
      try {
        console.log('--inside-try ensuredbisopen--');
        const isOpen = await this.db.isDBOpen();
        if (!isOpen) {
          console.warn('Database was closed, reopening...');
          await this.db.open();
        }
      } catch (openError) {
        console.warn(
          'Database open check failed, recreating connection...',
          openError
        );
        this.isDbInitialized = false;
        await this.initializeDatabase();
      }
    } catch (error) {
      console.error('Error ensuring database is open:', error);
      // Reset state and try one more time
      this.isDbInitialized = false;
      // this.initializationPromise = null;
      throw error;
    }
  }

  /* =============================================================== */
  /* Public API                                                      */
  /* =============================================================== */

  /** Insert (or overwrite) the last‑used credentials. */
  async storeLoginData(payload: any, lang: string): Promise<void> {
    this.ensureDbIsOpen();
    const emp = payload.data?.[0];
    if (Capacitor.getPlatform() == 'web') {
      await Preferences.set({
        key: 'userLanguage',
        value: lang,
      });
      await Preferences.set({
        key: 'loginData',
        value: JSON.stringify(payload),
      });
    } else {
      console.log('Storing employee data:', payload);
      await this.db.run(
        `INSERT OR REPLACE INTO App_Language (key, value) VALUES (?, ?)`,
        [1, lang]
      );

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

      // Store dhara data
      for (const dhara of payload.dhara_data || []) {
        await this.db.run(
          `INSERT OR REPLACE INTO dhara_data (id, dhara_head, dhara_year) VALUES (?, ?, ?)`,
          [dhara.id, dhara.dhara_head, dhara.dhara_year]
        );

        // Clear existing items for this dhara
        await this.db.run(`DELETE FROM dhara_items WHERE dhara_id = ?`, [
          dhara.id,
        ]);

        // Store each dhara item
        for (const item of dhara.dhara_comma_separated || []) {
          await this.db.run(
            `INSERT INTO dhara_items (dhara_id, item) VALUES (?, ?)`,
            [dhara.id, item]
          );
        }
      }

      // Store prajati names
      for (const prajati of payload.prajati_name || []) {
        await this.db.run(
          `INSERT OR REPLACE INTO prajati_name (id, name) VALUES (?, ?)`,
          [prajati.id, prajati.name]
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
    if (Capacitor.getPlatform() == 'web') {
      const data = await Preferences.get({ key: 'loginData' });
      return data.value ? JSON.parse(data.value) : null;
    } else {
      await this.ensureDbIsOpen();
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

      // 5. Get dhara data
      const dharaRes = await this.db.query('SELECT * FROM dhara_data');
      const dharaData = [];

      if (dharaRes.values && dharaRes.values.length > 0) {
        for (const dhara of dharaRes.values) {
          const itemsRes = await this.db.query(
            'SELECT item FROM dhara_items WHERE dhara_id = ?',
            [dhara.id]
          );
          dharaData.push({
            id: dhara.id,
            dhara_head: dhara.dhara_head,
            dhara_year: dhara.dhara_year,
            dhara_comma_separated: (itemsRes.values || []).map(
              (i: any) => i.item
            ),
          });
        }
      }
      result.dhara_data = dharaData;

      // 6. Get prajati names
      const prajatiRes = await this.db.query('SELECT * FROM prajati_name');
      result.prajati_name = prajatiRes.values || [];

      return result ? result : null;
    }
  }

  async LogoutUser(): Promise<boolean> {
    console.log('--logout-user--');
    try {
      if (Capacitor.getPlatform() === 'web') {
        console.log('--inside-logout-preference--');
        await Preferences.remove({ key: 'loginData' });
        await Preferences.remove({ key: 'userLanguage' });
        return true;
      } else {
        console.log('--inside-logout-sqlite--');

        // Ensure database is initialized and open
        await this.ensureDbIsOpen();

        let transactionStarted = false;

        try {
          // Try to start transaction
          await this.db.execute('BEGIN TRANSACTION');
          transactionStarted = true;

          console.log('Transaction started, deleting data...');

          // Delete in order to respect foreign key constraints
          await this.db.execute('DELETE FROM crime_photos;');
          await this.db.execute('DELETE FROM seized_goods_detail;');
          await this.db.execute('DELETE FROM crime_report;');
          await this.db.execute('DELETE FROM dhara_items;');
          await this.db.execute('DELETE FROM crim_dhara;');
          await this.db.execute('DELETE FROM beat_compartment;');
          await this.db.execute('DELETE FROM dhara_data;');
          await this.db.execute('DELETE FROM prajati_name;');
          await this.db.execute('DELETE FROM crim_type;');
          await this.db.execute('DELETE FROM cast_category;');
          await this.db.execute('DELETE FROM beat;');
          await this.db.execute('DELETE FROM users;');
          await this.db.execute('DELETE FROM login_user;');
          await this.db.execute('DELETE FROM App_Language;');

          // Commit transaction
          await this.db.execute('COMMIT');
          transactionStarted = false; // Mark as no longer active

          console.log('Logout cleanup completed successfully');
          return true;
        } catch (transactionError) {
          console.error(
            'Error during transaction operations:',
            transactionError
          );

          // Only rollback if transaction was actually started
          if (transactionStarted) {
            try {
              await this.db.execute('ROLLBACK');
              transactionStarted = false;
              console.log('Transaction rolled back successfully');
            } catch (rollbackError) {
              console.error('Error during rollback:', rollbackError);
              // Continue with cleanup despite rollback error
            }
          }

          throw transactionError; // Re-throw the original error
        }
      }
    } catch (error) {
      console.error('Error during logout:', error);

      // Fallback: try individual deletes without transaction
      try {
        console.log('Attempting fallback delete without transaction...');
        await this.fallbackDeleteWithoutTransaction();
        console.log('Fallback delete completed');
        return true;
      } catch (fallbackError) {
        console.error('Fallback delete also failed:', fallbackError);
        return false;
      }
    }
  }

  /**
   * Fallback method for deleting data without transactions
   */
  private async fallbackDeleteWithoutTransaction(): Promise<void> {
    try {
      // Delete in safe order (child tables first)
      const deleteQueries = [
        'DELETE FROM crime_photos;',
        'DELETE FROM seized_goods_detail;',
        'DELETE FROM crime_report;',
        'DELETE FROM dhara_items;',
        'DELETE FROM crim_dhara;',
        'DELETE FROM beat_compartment;',
        'DELETE FROM dhara_data;',
        'DELETE FROM prajati_name;',
        'DELETE FROM crim_type;',
        'DELETE FROM cast_category;',
        'DELETE FROM beat;',
        'DELETE FROM users;',
        'DELETE FROM login_user;',
        'DELETE FROM App_Language;',
      ];

      for (const query of deleteQueries) {
        try {
          await this.db.execute(query);
        } catch (queryError) {
          console.warn(`Query failed but continuing: ${query}`, queryError);
          // Continue with next query even if one fails
        }
      }
    } catch (error) {
      console.error('Fallback delete failed completely:', error);
      throw error;
    }
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

  /**
   * Store crime report with seized goods and photos
   */
  async storeCrimeReport(formData: any, photos: string[]): Promise<number> {
    await this.ensureDbIsOpen();
    console.log('--data-coming-from-offline--', formData, photos);

    let crimeReportId: number | undefined;

    try {
      // Start transaction
      await this.db.execute('BEGIN TRANSACTION');

      let compartmentNumber = '';
      if (formData.compartment_number) {
        if (Array.isArray(formData.compartment_number)) {
          compartmentNumber = formData.compartment_number.join(',');
        } else {
          compartmentNumber = String(formData.compartment_number);
        }
      }

      let crimeDhara = '';
      if (formData.crime_dhara) {
        if (Array.isArray(formData.crime_dhara)) {
          crimeDhara = formData.crime_dhara.join(',');
        } else {
          crimeDhara = String(formData.crime_dhara);
        }
      }

      // Insert into crime_report table
      const crimeReportResult = await this.db.run(
        `INSERT INTO crime_report (
        is_accused_found, accused_name, accused_fathers_name, accused_cast,
        accused_address, type_of_crime, place_of_crime, date_of_crime,
        details_of_seized_goods, created_by, lat, lng, map_address,
        circle_id, division_id, sub_division_id, range_id, sub_range_id,
        beat_id, name_of_witness_one, name_of_witness_two,
        address_of_witness_one, address_of_witness_two, compartment_number,
        crime_dhara, por_number, is_synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Number(formData.is_accused_found),
          formData.accusedName,
          formData.accusedFathersName,
          formData.accusedCast || null,
          formData.accusedAddress,
          formData.typeOfCrime,
          formData.placeOfCrime,
          formData.dateOfCrime,
          formData.detailsOfSeizedGoods,
          formData.createdBy,
          formData.lat || null,
          formData.lng || null,
          formData.map_address || '',
          formData.circle_id || null,
          formData.division_id || null,
          formData.sub_division_id || null,
          formData.range_id || null,
          formData.sub_range_id || null,
          formData.beat_id || null,
          formData.name_of_witness_one || '',
          formData.name_of_witness_two || '',
          formData.address_of_witness_one || '',
          formData.address_of_witness_two || '',
          compartmentNumber,
          crimeDhara,
          formData.por_number || '',
          0, // is_synced = false
        ]
      );

      crimeReportId = crimeReportResult.changes?.lastId;

      if (!crimeReportId) {
        throw new Error('Failed to insert crime report - no lastId returned');
      }

      // Insert seized goods details
      if (formData.Saman_Detail) {
        try {
          const samanDetails = JSON.parse(formData.Saman_Detail);
          for (const saman of samanDetails) {
            await this.db.run(
              `INSERT INTO seized_goods_detail (
              crime_report_id, jabti_saman_type, prajati_type, lambai,
              golai, ghan_meter, nag, dar, total_cost, if_other_then_detail
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                crimeReportId,
                saman.jabti_saman_type,
                saman.prajati_type,
                saman.lambai || '',
                saman.golai || '',
                saman.ghan_meter || '',
                saman.nag || '',
                saman.dar || '',
                saman.total_cost || '',
                saman.if_other_then_detail || '',
              ]
            );
          }
        } catch (parseError) {
          console.warn('Failed to parse Saman_Detail:', parseError);
          // Continue without seized goods details
        }
      }

      // Utility function to convert base64 string to Uint8Array
      function base64ToUint8Array(base64: string): Uint8Array {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }

      // Insert photos as BLOB
      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          let photoData = photos[i];

          // Extract base64 data from data URL
          if (
            photoData &&
            typeof photoData === 'string' &&
            photoData.startsWith('data:image')
          ) {
            const parts = photoData.split(',');
            if (parts.length > 1) {
              photoData = parts[1]; // Take only the base64 content
            }
          }

          if (
            photoData &&
            typeof photoData === 'string' &&
            photoData.length > 0
          ) {
            try {
              const photoBytes = base64ToUint8Array(photoData); // ✅ Convert to binary

              await this.db.run(
                `INSERT INTO crime_photos (crime_report_id, photo_data, file_name) VALUES (?, ?, ?)`,
                [
                  crimeReportId,
                  photoBytes,
                  `photo_${crimeReportId}_${i + 1}.jpg`,
                ]
              );

              console.log(`✅ Photo ${i + 1} inserted successfully`);
            } catch (err) {
              console.error(`❌ Failed to insert photo ${i + 1}:`, err);
            }
          } else {
            console.warn(`⚠️ Skipping invalid photo data at index ${i}`);
          }
        }
      }

      // Commit transaction
      await this.db.execute('COMMIT');

      console.log(`Crime report stored successfully with ID: ${crimeReportId}`);
      return crimeReportId;
    } catch (error) {
      // Rollback transaction on error
      try {
        await this.db.execute('ROLLBACK');
        console.log('Transaction rolled back due to error');
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }

      console.error('Error storing crime report:', error);

      // Provide more detailed error information
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to store crime report: ${errorMessage}`);
    }
  }

  /**
   * Verify if crime report was stored successfully
   */
  async verifyCrimeReportStored(reportId: number): Promise<boolean> {
    await this.ensureDbIsOpen();

    try {
      const reportResult = await this.db.query(
        `SELECT COUNT(*) as count FROM crime_report WHERE id = ?`,
        [reportId]
      );

      const reportExists = reportResult.values?.[0]?.count > 0;

      if (!reportExists) {
        console.error('Crime report not found in database');
        return false;
      }

      const seizedGoodsResult = await this.db.query(
        `SELECT COUNT(*) as count FROM seized_goods_detail WHERE crime_report_id = ?`,
        [reportId]
      );

      const photosResult = await this.db.query(
        `SELECT COUNT(*) as count FROM crime_photos WHERE crime_report_id = ?`,
        [reportId]
      );

      console.log('Verification Results:', {
        reportExists,
        seizedGoodsCount: seizedGoodsResult.values?.[0]?.count || 0,
        photosCount: photosResult.values?.[0]?.count || 0,
      });

      return true;
    } catch (error) {
      console.error('Error verifying crime report storage:', error);
      return false;
    }
  }
  async getOfflineCrimeReports(): Promise<any[]> {
    await this.ensureDbIsOpen();

    try {
      console.log('--inside-crime-report-getting-function--');

      // Get all crime reports
      const crimeReportsResult = await this.db.query(
        `SELECT * FROM crime_report ORDER BY created_at DESC`
      );

      const reportsWithDetails = [];

      // Process each crime report
      for (const report of crimeReportsResult.values ?? []) {
        // Get seized goods for this report
        const seizedGoodsResult = await this.db.query(
          `SELECT * FROM seized_goods_detail WHERE crime_report_id = ?`,
          [report.id]
        );

        // Get photos for this report - only get metadata, not the full base64 data
        const photosResult = await this.db.query(
          `SELECT id, file_name, created_at FROM crime_photos WHERE crime_report_id = ?`,
          [report.id]
        );

        // Get additional reference data for better display
        let accusedCastName = '';
        if (report.accused_cast) {
          const castResult = await this.db.query(
            `SELECT name FROM cast_category WHERE id = ?`,
            [report.accused_cast]
          );
          accusedCastName = castResult.values?.[0]?.name || '';
        }

        let crimeTypeName = '';
        if (report.type_of_crime) {
          const crimeTypeResult = await this.db.query(
            `SELECT name FROM crim_type WHERE id = ?`,
            [report.type_of_crime]
          );
          crimeTypeName = crimeTypeResult.values?.[0]?.name || '';
        }

        let beatName = '';
        if (report.beat_id) {
          const beatResult = await this.db.query(
            `SELECT name FROM beat WHERE id = ?`,
            [report.beat_id]
          );
          beatName = beatResult.values?.[0]?.name || '';
        }

        // Process seized goods to include prajati names
        const seizedGoodsWithNames = [];
        for (const goods of seizedGoodsResult.values || []) {
          let jabtiSamanName = '';
          let prajatiName = '';

          if (goods.jabti_saman_type) {
            const jabtiResult = await this.db.query(
              `SELECT name FROM prajati_name WHERE id = ?`,
              [goods.jabti_saman_type]
            );
            jabtiSamanName = jabtiResult.values?.[0]?.name || '';
          }

          if (goods.prajati_type) {
            const prajatiResult = await this.db.query(
              `SELECT name FROM prajati_name WHERE id = ?`,
              [goods.prajati_type]
            );
            prajatiName = prajatiResult.values?.[0]?.name || '';
          }

          seizedGoodsWithNames.push({
            ...goods,
            jabti_saman_name: jabtiSamanName,
            prajati_name: prajatiName,
          });
        }

        // Format the report with all details
        reportsWithDetails.push({
          id: report.id,
          is_accused_found: report.is_accused_found,
          accused_name: report.accused_name,
          accused_fathers_name: report.accused_fathers_name,
          accused_cast: report.accused_cast,
          accused_cast_name: accusedCastName,
          accused_address: report.accused_address,
          type_of_crime: report.type_of_crime,
          type_of_crime_name: crimeTypeName,
          place_of_crime: report.place_of_crime,
          date_of_crime: report.date_of_crime,
          details_of_seized_goods: report.details_of_seized_goods,
          created_by: report.created_by,
          lat: report.lat,
          lng: report.lng,
          map_address: report.map_address,
          circle_id: report.circle_id,
          division_id: report.division_id,
          sub_division_id: report.sub_division_id,
          range_id: report.range_id,
          sub_range_id: report.sub_range_id,
          beat_id: report.beat_id,
          beat_name: beatName,
          name_of_witness_one: report.name_of_witness_one,
          name_of_witness_two: report.name_of_witness_two,
          address_of_witness_one: report.address_of_witness_one,
          address_of_witness_two: report.address_of_witness_two,
          compartment_number: report.compartment_number,
          crime_dhara: report.crime_dhara,
          por_number: report.por_number,
          created_at: report.created_at,
          is_synced: report.is_synced,
          seized_goods: seizedGoodsWithNames,
          photos: photosResult.values || [],
          total_seized_goods: seizedGoodsResult.values?.length || 0,
          total_photos: photosResult.values?.length || 0,
          status: report.is_synced ? 'Synced' : 'Pending Sync',
          formatted_date: report.created_at
            ? new Date(report.created_at).toLocaleString()
            : '',
        });
      }

      console.log(`Retrieved ${reportsWithDetails.length} crime reports`);
      return reportsWithDetails;
    } catch (error) {
      console.error('Error retrieving crime reports:', error);
      return [];
    }
  }

  /**
   * Get unsynced crime reports
   */
  async getUnsyncedCrimeReports(): Promise<any[]> {
    await this.ensureDbIsOpen();

    try {
      const reports = await this.db.query(
        `SELECT * FROM crime_report WHERE is_synced = 0 ORDER BY created_at DESC`
      );
      return reports.values || [];
    } catch (error) {
      console.error('Error retrieving unsynced reports:', error);
      return [];
    }
  }

  /**
   * Mark crime report as synced
   */
  async markCrimeReportAsSynced(reportId: number): Promise<void> {
    await this.ensureDbIsOpen();

    try {
      await this.db.run(`UPDATE crime_report SET is_synced = 1 WHERE id = ?`, [
        reportId,
      ]);
    } catch (error) {
      console.error('Error marking report as synced:', error);
      throw error;
    }
  }

  /**
   * Delete crime report - FIXED TRANSACTION
   */
  async deleteCrimeReport(reportId: number): Promise<void> {
    try {
      await this.ensureDbIsOpen();

      // Use proper transaction methods
      await this.db.beginTransaction();

      await this.db.run('DELETE FROM crime_photos WHERE crime_report_id = ?', [
        reportId,
      ]);

      await this.db.run(
        'DELETE FROM seized_goods_detail WHERE crime_report_id = ?',
        [reportId]
      );

      await this.db.run('DELETE FROM crime_report WHERE id = ?', [reportId]);

      await this.db.commitTransaction();
    } catch (error) {
      try {
        await this.db.rollbackTransaction();
      } catch (rollbackError) {
        console.error('Error during rollback:', rollbackError);
      }
      console.error('Error deleting crime report:', error);
      throw error;
    }
  }

  /**
   * Get crime report statistics
   */
  async getCrimeReportStats(): Promise<{ total: number; pending: number }> {
    await this.ensureDbIsOpen();

    try {
      const totalResult = await this.db.query(
        `SELECT COUNT(*) as count FROM crime_report`
      );
      const pendingResult = await this.db.query(
        `SELECT COUNT(*) as count FROM crime_report WHERE is_synced = 0`
      );

      return {
        total: totalResult.values?.[0]?.count ?? 0,
        pending: pendingResult.values?.[0]?.count ?? 0,
      };
    } catch (error) {
      console.error('Error getting crime report stats:', error);
      return { total: 0, pending: 0 };
    }
  }

  /**
   * Get detailed information about stored crime report
   */
  async getStoredCrimeReportDetails(reportId: number): Promise<any> {
    await this.ensureDbIsOpen();

    try {
      const reportResult = await this.db.query(
        `SELECT * FROM crime_report WHERE id = ?`,
        [reportId]
      );

      if (!reportResult.values || reportResult.values.length === 0) {
        return { error: 'Report not found' };
      }

      const report = reportResult.values[0];

      const seizedGoodsResult = await this.db.query(
        `SELECT * FROM seized_goods_detail WHERE crime_report_id = ?`,
        [reportId]
      );

      const photosResult = await this.db.query(
        `SELECT id, file_name, created_at FROM crime_photos WHERE crime_report_id = ?`,
        [reportId]
      );

      return {
        crimeReport: report,
        seizedGoods: seizedGoodsResult.values || [],
        photos: photosResult.values || [],
        totalRecords: {
          crimeReport: 1,
          seizedGoods: seizedGoodsResult.values?.length || 0,
          photos: photosResult.values?.length || 0,
        },
      };
    } catch (error) {
      console.error('Error getting report details:', error);
      return {
        error:
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as any).message
            : String(error),
      };
    }
  }

  /**
   * Get all stored crime reports summary
   */
  async getAllStoredCrimeReports(): Promise<any[]> {
    await this.ensureDbIsOpen();

    try {
      const result = await this.db.query(`
        SELECT 
          cr.id,
          cr.accused_name,
          cr.place_of_crime,
          cr.date_of_crime,
          cr.created_at,
          cr.is_synced,
          COUNT(DISTINCT sg.id) as seized_goods_count,
          COUNT(DISTINCT cp.id) as photos_count
        FROM crime_report cr
        LEFT JOIN seized_goods_detail sg ON cr.id = sg.crime_report_id
        LEFT JOIN crime_photos cp ON cr.id = cp.crime_report_id
        GROUP BY cr.id
        ORDER BY cr.created_at DESC
      `);

      return result.values || [];
    } catch (error) {
      console.error('Error getting all reports:', error);
      return [];
    }
  }
}
