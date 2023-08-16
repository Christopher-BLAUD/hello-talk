import { db } from "./db";

export const deleteSentence = async (sentenceId) => {
    return await db.sentences.delete(sentenceId);
};