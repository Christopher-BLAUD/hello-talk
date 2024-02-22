import { setFilter } from '../src/utils/helpers/setFilter.Js';

const words = [
    {
        id: 1,
        original: 'bonjour',
        translation: 'hello',
        category: 'Présentation',
        score: 20
    },
    {
        id: 2,
        original: 'manger',
        translation: 'to eat',
        category: 'Repas',
        score: 9
    },
    {
        id: 3,
        original: 'danser',
        translation: 'to dance',
        category: 'Loisirs',
        score: 5
    },
    {
        id: 4,
        original: 'nom',
        translation: 'name',
        category: 'Présentation',
        score: 4
    },
    {
        id: 5,
        original: 'chanter',
        translation: 'to sing',
        category: 'Loisirs',
        score: 1
    }
];

describe('set filter', () => {
    it('should return a words array sorted by id', () => {
        expect(setFilter('id', words)).toStrictEqual(words)
    });

    it('should return a words array sorted by alphabetical order', () => {
        const expected = [
            {
                id: 1,
                original: 'bonjour',
                translation: 'hello',
                category: 'Présentation',
                score: 20
            },
            {
                id: 5,
                original: 'chanter',
                translation: 'to sing',
                category: 'Loisirs',
                score: 1
            },
            {
                id: 3,
                original: 'danser',
                translation: 'to dance',
                category: 'Loisirs',
                score: 5
            },
            {
                id: 2,
                original: 'manger',
                translation: 'to eat',
                category: 'Repas',
                score: 9
            },
            {
                id: 4,
                original: 'nom',
                translation: 'name',
                category: 'Présentation',
                score: 4
            },
        ]

        expect(setFilter('alphabetical', words)).toStrictEqual(expected)
    })

    it('should return a words array sorted by category', () => {
        const expected = [
            {
                id: 5,
                original: 'chanter',
                translation: 'to sing',
                category: 'Loisirs',
                score: 1
            },
            {
                id: 3,
                original: 'danser',
                translation: 'to dance',
                category: 'Loisirs',
                score: 5
            },
            {
                id: 1,
                original: 'bonjour',
                translation: 'hello',
                category: 'Présentation',
                score: 20
            },
            {
                id: 4,
                original: 'nom',
                translation: 'name',
                category: 'Présentation',
                score: 4
            },
            {
                id: 2,
                original: 'manger',
                translation: 'to eat',
                category: 'Repas',
                score: 9
            },
        ]

        expect(setFilter('category', words)).toStrictEqual(expected)
    })

    it('should return a words array sorted by score', () => {
        expect(setFilter('score', words)).toStrictEqual(words)
    })
});
