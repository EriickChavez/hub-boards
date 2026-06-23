import type { Project } from "../types/types";

const DB_NAME = "HubBoardsDB";
const DB_VERSION = 1;
const STORE_NAME = "projects";

export const SEED_PROJECTS: Project[] = [];

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export const getProjectsFromDB = async (): Promise<Project[]> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB error during read:", error);
    return [];
  }
};

export const saveProjectsToDB = async (projects: Project[]): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);

      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        if (projects.length === 0) {
          resolve();
          return;
        }

        let completed = 0;
        let failed = false;

        projects.forEach((proj) => {
          const addRequest = store.add(proj);

          addRequest.onsuccess = () => {
            completed++;
            if (completed === projects.length && !failed) {
              resolve();
            }
          };

          addRequest.onerror = () => {
            if (!failed) {
              failed = true;
              reject(addRequest.error);
            }
          };
        });
      };

      clearRequest.onerror = () => {
        reject(clearRequest.error);
      };
    });
  } catch (error) {
    console.error("IndexedDB error during save:", error);
  }
};
