import NetInfo from "@react-native-community/netinfo";
import { openDatabase } from 'expo-sqlite';
import firestore from '@react-native-firebase/firestore';
import { Workbook } from '../../types';

const db = openDatabase('gridmobile.db');

class SyncQueue {
  private isOnline: boolean = false;
  private queueProcessing: boolean = false;

  constructor() {
    this.initDB();
    NetInfo.addEventListener(state => {
      this.isOnline = !!state.isConnected;
      if (this.isOnline) this.processQueue();
    });
  }

  private initDB() {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sync_queue (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT, payload TEXT, timestamp INTEGER);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS local_workbooks (id TEXT PRIMARY KEY, data TEXT, updated_at INTEGER);'
      );
    });
  }

  // Save to SQLite immediately, attempt cloud sync if online
  public async saveWorkbookLocal(workbook: Workbook) {
    const data = JSON.stringify(workbook);
    return new Promise<void>((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO local_workbooks (id, data, updated_at) VALUES (?, ?, ?);',
          [workbook.id, data, Date.now()],
          () => resolve(),
          (_, err) => { reject(err); return false; }
        );
      });
      
      // Add to sync queue
      this.addToQueue('UPDATE_WORKBOOK', workbook);
    });
  }

  private addToQueue(action: string, payload: any) {
    const json = JSON.stringify(payload);
    db.transaction(tx => {
      tx.executeSql('INSERT INTO sync_queue (action, payload, timestamp) VALUES (?, ?, ?);', [action, json, Date.now()]);
    });
    if (this.isOnline) this.processQueue();
  }

  private async processQueue() {
    if (this.queueProcessing || !this.isOnline) return;
    this.queueProcessing = true;

    // Fetch pending items
    // Iterate and push to Firestore
    // On success, DELETE from sync_queue

    // Simplified Firestore logic:
    // await firestore().collection('workbooks').doc(workbookId).update(data);
    
    this.queueProcessing = false;
  }
}

export const syncService = new SyncQueue();
