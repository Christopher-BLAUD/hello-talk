import { findANumber } from '../utils/Helpers/regex';
import { db } from '../utils/Helpers/db';

class Word {
    constructor(original, translation, category, sound, score) {
        this.original = original;
        this.translation = translation;
        this.category = category;
        this.sound = sound;
        this.score = score || 0;
    }

    async save() {
        if (findANumber.test(this.original) || findANumber.test(this.translation)) throw new Error('Original and translation values must be strings');

        if (this.original !== undefined && this.translation !== undefined && this.category !== undefined && this.sound !== undefined) {
            await db.words.add(this);
        } else {
            throw new Error('Word is empty');
        }
    }

    static async getWord(id) {
        try {
            return await db.words.where('id').equals(id).toArray();
        } catch (error) {
            throw new Error('Database connection error');
        }
    }
    
    static async update(id, changes) {
        try {
            await db.words.update(id, changes);
        } catch (e) {
            throw new Error('Error while updating word');
        }
    }

    static async delete(id) {
        try {
            await db.words.delete(id)
        } catch (e) {
            throw new Error('Error while deleting word')
        }
    }
}

export default Word;
