import Dexie from 'dexie';

export const db = new Dexie('HelloDB');

db.version(1).stores({
    words: '++id, original, engTranslation, category, sound',
    categories: '++id, name',
    sentences: '++id, sentence, *sounds'
});

db.version(2)
    .stores({
        words: '++id, original, translation, category, sound, score',
        categories: '++id, name, score',
        sentences: '++id, sentence, *sounds, score'
    })
    .upgrade((tx) => {
        return tx.table('words').modify((word) => {
            word.translation = word.engTranslation;
            delete word.engTranslation;
        });
    });
