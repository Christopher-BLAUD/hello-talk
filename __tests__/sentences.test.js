import Sentence from '../src/controllers/sentences';
import { db } from '../src/utils/helpers/db';

jest.mock('../src/utils/helpers/db');
Sentence.save = jest.fn();
Sentence.delete = jest.fn();
Sentence.findOne = jest.fn();

describe('sentence', () => {
    const sentence = new Sentence('bonjour mon nom est christopher', ['./sounds/bonjour', './sounds/mon', './sounds/nom', './sounds/est', './sounds/christopher']);

    it('should return the string of sentence', () => {
        expect(sentence.sentence).toEqual('bonjour mon nom est christopher');
    });

    it('should return an array of sound path', () => {
        expect(sentence.sounds).toEqual(['./sounds/bonjour', './sounds/mon', './sounds/nom', './sounds/est', './sounds/christopher']);
    });

    it('should return 0 to the score', () => {
        expect(sentence.score).toEqual(0);
    });

    it('should save a sentence', async () => {
        await sentence.save();

        expect(db.sentences.add).toHaveBeenCalledWith(sentence);
    });

    it('should call the delete method with specific parameters', async () => {
        const id = 1;

        await Sentence.delete(id);

        expect(Sentence.delete).toHaveBeenCalledTimes(1);
        expect(Sentence.delete).toHaveBeenCalledWith(id);
    });

    it('should call the findOne method by id', async () => {
        const id = 3;

        await Sentence.findOne(id);

        expect(Sentence.findOne).toHaveBeenCalledTimes(1);
        expect(Sentence.findOne).toHaveBeenCalledWith(id);
    });
});
