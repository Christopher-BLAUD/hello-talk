import { getLastSentences } from '../src/utils/helpers/getLastSentences';

let sentencesArr = ['Hello my name is John', 'How are you', "I'm 34 years old", "What colors are the arch duchess's socks", 'In tartiflette we trust'];

it('should return only the last 4 sentences', () => {
    expect(getLastSentences(sentencesArr, 4).length).toBe(4);
});

it('should return only the last 2 sentences', () => {
    expect(getLastSentences(sentencesArr, 2).length).toBe(2);
});

it('should return an error if no sentence is available', () => {
    let sentences = [];

    expect(() => getLastSentences(sentences, 2)).toThrow('No sentences are saved in the database.');
});

it('should return the last 4 sentences order by desc', () => {
    let reversedSentences = ['In tartiflette we trust', "What colors are the arch duchess's socks", "I'm 34 years old", 'How are you'];

    expect(getLastSentences(sentencesArr, 4)).toEqual(reversedSentences);
});