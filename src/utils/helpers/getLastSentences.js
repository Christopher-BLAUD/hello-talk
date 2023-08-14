export const getLastSentences = (sentences, limit) => {
    let sentencesSorted = sentences.reverse().slice(0, limit);
    if (sentencesSorted.length === 0) throw new Error('No sentences are saved in the database.');

    return sentencesSorted;
};
