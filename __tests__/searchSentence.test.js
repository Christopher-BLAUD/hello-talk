import { searchSentence } from "../src/components/Sentences/Sentences";


const sentences = [
    {
        sentence: "bonjour mon nom est marius",
        sounds: ['bonjour.mp3', 'mon.mp3', 'nom.mp3', 'est.mp3', 'marius.mp3']
    },
    {
        sentence: "je veux manger",
        sounds: ['je.mp3', 'veux.mp3', 'manger.mp3']
    },
    {
        sentence: "moi heureux",
        sounds: ['moi.mp3', 'heureux.mp3']
    }
]

it('should return a sentences array with specific result', () => {
    const expected = [{
        sentence: "moi heureux",
        sounds: ['moi.mp3', 'heureux.mp3']
    }]

    expect(searchSentence(sentences, "moi heureux")).toStrictEqual(expected)
    expect(searchSentence(sentences, "")).toStrictEqual([])
})