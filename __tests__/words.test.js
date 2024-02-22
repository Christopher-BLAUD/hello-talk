import Word from '../src/controllers/words';
import { db } from '../src/utils/helpers/db';

jest.mock('../src/utils/helpers/db');

Word.getWord = jest.fn();
Word.update = jest.fn();
Word.delete = jest.fn();

describe('word', () => {
    const word = new Word('bonjour', 'hello', 'Présentation', './sounds/bonjour.mp3');

    it('should return the original word', () => {
        expect(word.original).toBe('bonjour');
    });

    it('should return the translation', () => {
        expect(word.translation).toBe('hello');
    });

    it('should return the category', () => {
        expect(word.category).toBe('Présentation');
    });

    it('should return the sound path', () => {
        expect(word.sound).toBe('./sounds/bonjour.mp3');
    });

    it('should return the default score', () => {
        expect(word.score).toBe(0);
    });

    it('should throw en Error when word is empty', async () => {
        const emptyWord = new Word();

        await expect(emptyWord.save()).rejects.toThrowError();
    });

    it('should throw an error if type of original is not a string', async () => {
        const otherWord = new Word(0, 'hello', 'Présentation', './sounds/coucou.mp3');

        await expect(otherWord.save()).rejects.toThrowError();
    });

    it('should throw an error if type of translation is not a string', async () => {
        const otherWord = new Word('bonjour', 0, 'Présentation', './sounds/coucou.mp3');

        await expect(otherWord.save()).rejects.toThrowError();
    });

    it('should save a Word', async () => {
        await word.save();

        expect(db.words.add).toHaveBeenCalledWith(word);
        expect(db.words.add).toHaveBeenCalledTimes(1);
    });

    it('should call getWord with specific parameters', () => {
        const id = 2;

        Word.getWord(id);

        expect(Word.getWord).toHaveBeenCalledWith(id);
        expect(Word.getWord).toHaveBeenCalledTimes(1);
    });

    it('should to call the update method with specific parameters', () => {
        const id = 3;
        const changes = { original: 'salut', translation: 'hi' };

        Word.update(id, changes);

        expect(Word.update).toHaveBeenCalledWith(id, changes);
        expect(Word.update).toHaveBeenCalledTimes(1);
    });

    it('should to call the delete method with the word id', () => {
        const name = 'Présentation';

        Word.delete(name);

        expect(Word.delete).toHaveBeenCalledWith(name);
        expect(Word.delete).toHaveBeenCalledTimes(1);
    });
});
