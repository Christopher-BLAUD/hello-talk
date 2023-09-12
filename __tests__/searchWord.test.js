import { searchWord } from '../src/components/Words/Words';

const words = [
    {
        original: 'bonjour',
        translation: 'hello',
        category: 'Présentation',
        sound: './sounds/bonjour.mp3',
        score: 0
    },
    {
        original: 'salut',
        translation: 'hi',
        category: 'Présentation',
        sound: './sounds/salut.mp3',
        score: 0
    },
    {
        original: 'mon',
        translation: 'my',
        category: 'Présentation',
        sound: './sounds/mon.mp3',
        score: 0
    },
    {
        original: 'nom',
        translation: 'name',
        category: 'Présentation',
        sound: './sounds/nom.mp3',
        score: 0
    }
];

it('should return a words array started with specific value', () => {
    const expected = [
        {
            original: 'mon',
            translation: 'my',
            category: 'Présentation',
            sound: './sounds/mon.mp3',
            score: 0
        }
    ];

    expect(searchWord(words, 'mon')).toStrictEqual(expected);
    expect(searchWord(words, '')).toStrictEqual([]);
});
