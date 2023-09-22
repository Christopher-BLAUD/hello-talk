import Dexie from 'dexie';

export const db = new Dexie('HelloDB');

db.version(1).stores({
    words: '++id, original, engTranslation, category, sound',
    categories: '++id, name',
    sentences: '++id, sentence, *sounds'
});

db.version(2).stores({
    words: '++id, original, translation, category, sound, score',
    categories: '++id, name, score',
    sentences: '++id, sentence, *sounds, score'
});

db.version(3).stores({
    words: '++id, original, translation, category, sound, score',
    categories: '++id, name, score',
    sentences: '++id, sentence, *sounds, score'
});

db.version(4)
    .stores({
        words: '++id, original, translation, category, sound, score',
        categories: '++id, name, color, score',
        sentences: '++id, sentence, *sounds, score'
    })
    .upgrade(async (tx) => {
        const oldRecords = await tx.words.toArray();

        const updatedRecords = oldRecords.map((record) => ({
            translation: record.engTranslation
        }));

        await tx.words.bulkPut(updatedRecords);

        await tx.words.toCollection().modify((record) => {
            delete record.engTranslation;
        });
    });

db.version(5)
    .stores({
        words: '++id, original, translation, category, sound, score',
        categories: '++id, name, color, score',
        sentences: '++id, sentence, *sounds, score'
    })
    .upgrade(async (tx) => {
        const oldRecords = await tx.words.toArray();

        oldRecords.map((record) => {
            return db.words.update(record.id, { score: 0 });
        });
    });

