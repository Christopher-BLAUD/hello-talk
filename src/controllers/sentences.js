import { db } from '../utils/Helpers/db';

class Sentence {
    constructor(string, sound, score) {
        this.string = string;
        this.sound = sound || [];
        this.score = score || 0;
    }

    async save() {
        if (this.string !== undefined && this.sound.length > 0) {
            await db.sentences.add(this);
        } else {
            throw new Error('Sentence contains no data');
        }
    }
}

export default Sentence;
