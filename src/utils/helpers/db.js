import Dexie from 'dexie';

export const db = new Dexie('HelloDB');

db.version(1).stores({
    words: '++id, original, engTranslation, category, soundPath, recurrent',
    categories: "++id, name"
});