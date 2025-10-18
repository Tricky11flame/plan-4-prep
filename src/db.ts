// src/db.ts
import Dexie, { type Table } from 'dexie';
import type { StudyMaterial, TestSession } from './types'; // Import TestSession

export class MyStudyDatabase extends Dexie {
  materials!: Table<StudyMaterial, string>; 
  // ADD THIS NEW TABLE DEFINITION
  savedCourses!: Table<{ id: number, session: TestSession }, number>; // <[data type], [primary key type]>

  constructor() {
    super('myStudyDatabase');
    
    // BUMP THE VERSION FROM 1 to 2
    this.version(2).stores({
      materials: 'name',
      // ADD THE SCHEMA FOR THE NEW TABLE
      // 'id' will be the primary key (e.g., 1)
      savedCourses: 'id' 
    });

    // This just handles if you were on version 1 before
    this.version(1).stores({
      materials: 'name'
    });
  }
}

export const db = new MyStudyDatabase();