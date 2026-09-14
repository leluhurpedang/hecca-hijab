const DB_NAME = 'hecca_db';
const DB_VERSION = 3;

let dbInstance = null;

/**
 * Open or retrieve the active IndexedDB instance
 * @returns {Promise<IDBDatabase>}
 */
export function openDB() {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Products Store
      if (!db.objectStoreNames.contains('products')) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' });
        productStore.createIndex('slug', 'slug', { unique: true });
        productStore.createIndex('category', 'category', { unique: false });
        productStore.createIndex('isVisible', 'isVisible', { unique: false });
      }

      // 2. Images Store (Storing Blobs efficiently instead of Base64 strings)
      if (!db.objectStoreNames.contains('images')) {
        db.createObjectStore('images', { keyPath: 'id' });
      }

      // 3. Legacy CMS Store (for backwards compatibility)
      if (!db.objectStoreNames.contains('cms')) {
        db.createObjectStore('cms', { keyPath: 'key' });
      }

      // 4. Centralized Site Settings Store
      if (!db.objectStoreNames.contains('siteSettings')) {
        db.createObjectStore('siteSettings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.error('IndexedDB open error:', event.target.error);
      reject(event.target.error);
    };
  });
}

/**
 * Perform a database transaction
 * @param {string} storeName 
 * @param {'readonly' | 'readwrite'} mode 
 * @param {(store: IDBObjectStore) => Promise<any>} callback 
 */
export async function withStore(storeName, mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    let result;
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error('Transaction aborted'));

    try {
      result = callback(store);
    } catch (err) {
      reject(err);
    }
  });
}
