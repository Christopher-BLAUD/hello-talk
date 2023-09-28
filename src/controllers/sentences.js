import { db } from '../utils/Helpers/db';

class Sentence {
    constructor(sentence, sounds, score) {
        this.sentence = sentence;
        this.sounds = sounds || [];
        this.score = score || 0;
    }

    async save() {
        if (this.sentence !== undefined && this.sounds.length > 0) {
            await db.sentences.add(this);
        } else {
            throw new Error('Sentence contains no data');
        }
    }

    static async findOne(str) {
        try {
            return await db.sentences.where('sentence').equals(str).toArray()
        } catch (e) {
            throw new Error('An error occurred while finding the sentence')
        }
    }

    static async updateScore(id, changes) {
        try {
            await db.sentences.update(id, changes)
        } catch (e) {
            throw new Error('An error occurred while updating the score')
        }
    }

    static async delete(id) {
        try {
            await db.sentences.delete(id)
        } catch (e) {
            throw new Error('An error occurred while deleting the sentence.')
        }
    }
}

export default Sentence;
